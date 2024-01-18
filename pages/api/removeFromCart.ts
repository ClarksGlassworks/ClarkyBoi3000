// pages/api/product/[id].ts
import withSession from "../../lib/withSession";

async function handler(req, res) {
  const { key } = req.query;
  const variables = { key: key };
  try {
    const response = await fetch('https://wp.clarksglassworks.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'woocommerce-session': `Session ${req.sessionToken ? req.sessionToken : ''}`,
      },
      body: JSON.stringify({
        query: `
        mutation RemoveFromCart($keys: [ID!]!) {
          removeItemsFromCart(input: { keys: $keys }) {
            cartItems {
              key
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
        variables: {
          keys: [variables.key], // assuming variables.id is the key of the item you want to remove
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { data } = await response.json();

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
