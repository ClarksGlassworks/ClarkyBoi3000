// pages/api/product/[id].ts
import withSession from "../../lib/withSession";

async function handler(req, res) {
  const { id, quantity } = req.query;

  const variables = { id: parseInt(id, 10), quantity: parseInt(quantity) };

  try {
    const response = await fetch('https://wp.clarksglassworks.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'woocommerce-session': `Session ${req.sessionToken ? req.sessionToken : ''}`,
      },
      body: JSON.stringify({
        query: `
        mutation AddToCart($id: Int!, $quantity: Int!) {
          addToCart(input: { productId: $id, quantity: $quantity }) {
            cartItem {
              product {
                node {
                  id
                  name
                }
              }
              quantity
            }
          }
        }
        `,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { data } = await response.json();
    console.log({data})

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
