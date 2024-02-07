import withSession from "../../lib/withSession";

// should I fetch the contents from the cart and then create a new order with the contents?
// or should I run the checkout function?



async function handler(req, res) {
  // console.log({ req });
  const { code } = req.body

  const variables = { code: code };
  try {
    const response = await fetch('https://wp.clarksglassworks.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'woocommerce-session': `Session ${req.sessionToken ? req.sessionToken : ''}`,
      },
      body: JSON.stringify({
        query: `
          mutation MyMutation2($code: String!) {
            applyCoupon(input: { code: $code }) {
              clientMutationId
            }
          }
        `,
        variables,
      }),
    });

    if (!req.sessionToken) {
      res.newSessionToken = response.headers.get('woocommerce-session');
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { data } = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching product' });
  }
}
  

  export default withSession(handler);
