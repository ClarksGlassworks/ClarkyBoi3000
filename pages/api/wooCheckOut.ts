// pages/api/product/[id].ts
import withSession from "../../lib/withSession";

async function handler(req, res) {
    try {
        const { cart } = req.body;

        console.log(cart);
        const lineItems = cart.contents.nodes.map((item) => ({
            productId: item.product.node.id,
            quantity: item.quantity,
        }));

        console.log({ lineItems })

        const response = await fetch('https://wp.clarksglassworks.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'woocommerce-session': `Session ${req.sessionToken ? req.sessionToken : ''}`,
            },
            body: JSON.stringify({
                query: `
                mutation Checkout {
                    checkout(input: { paymentMethod: "bacs" }) {
                        clientMutationId,
                    }
                }
                `,
                variables: {
                    lineItems,
                },
            }),
        });

        console.log('---->', response);
        if (!response.ok) {
            console.error('HTTP status:', response.status);
            console.error('Status text:', response.statusText);
            throw new Error('Network response was not ok');
        }

        const responseBody = await response.json();

        if (responseBody.errors) {
            console.error('GraphQL Errors:', responseBody.errors);
            throw new Error('Error in GraphQL query or mutation');
        }

        const { data } = responseBody;

        console.log({ data });

        if (!req.sessionToken) {
            res.setHeader('Set-Cookie', `woocommerce-session=${response.headers.get('woocommerce-session')}; HttpOnly`);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching product' });
    }
}

export default withSession(handler);
