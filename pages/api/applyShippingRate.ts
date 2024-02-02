import withSession from "../../lib/withSession";

// should I fetch the contents from the cart and then create a new order with the contents?
// or should I run the checkout function?



async function handler(req, res) {
  const { id } = req.body;
  const variables = { input: { shippingMethods: id } };
  try {
    const response = await fetch('https://wp.clarksglassworks.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'woocommerce-session': `Session ${req.sessionToken ? req.sessionToken : ''}`,
      },
      body: JSON.stringify({
        query: `
        mutation MyMutation2($input: UpdateShippingMethodInput!) {
          updateShippingMethod(input: $input) {
            cart {
              chosenShippingMethods
            }
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
