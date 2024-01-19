import client from '../../lib/paypal'
import paypal from '@paypal/checkout-server-sdk'


export default async function Handler(req, res) {

  if(req.method != "POST")
    return res.status(404).json({success: false, message: "Not Found"})

  if(!req.body.order_price)
    return res.status(400).json({success: false, message: "Please Provide order_price And User ID"})


  try{
    const PaypalClient = client()
    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const request = new paypal.orders.OrdersCreateRequest()
    request.headers['prefer'] = 'return=representation'
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: 'd9f80740-38f0-11e8-b467-0ed5f89f718b', // wooCommerce Product ID?
          amount: {
            currency_code: 'CAD',
            value: req.body.order_price+"",
          },
        },
      ],
    })
    const response = await PaypalClient.execute(request)

    console.log("RES: ", response)

    if (response.statusCode !== 201) {
      console.log("RES: ", response)
      return res.status(500).json({success: false, message: "Some Error Occured at backend"})
    }

    res.status(200).json({success: true, data: response.result})
  } 
  catch(err){
    console.log("Err at Create Order: ", err)
  
    return res.status(500).json({success: false, message: err.message})
  }

}
