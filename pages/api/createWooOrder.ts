// pages/api/createOrder.ts

// import WooCommerceAPI from "woocommerce-api";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

async function handler(req, res) {
    const { cart, customer:customerData } =
        req.body;

    console.log('----> createWooOrder', cart)
    const customer = customerData.customer
    const shipping = cart?.chosenShippingMethods[0]
    console.log('-customer-', customer)
    const data = {
        payment_method: "bacs",
        payment_method_title: "Direct Bank Transfer",
        set_paid: false,
        first_name: customer?.firstName?.toString(),
        last_name: customer?.lastName?.toString(),
        email: customer?.billing?.email?.toString(),
        billing: {
            first_name: customer?.shipping?.firstName?.toString(),
            last_name: customer?.shipping?.lastName?.toString(),
            address_1: customer?.shipping?.address1?.toString(),
            address_2: customer?.shipping?.address2?.toString(),
            city: customer?.shipping?.city?.toString(),
            state: customer?.shipping?.state?.toString(),
            postcode: customer?.shipping?.postcode?.toString(),
            country: customer?.shipping?.country?.toString(),
            email: customer?.billing?.email?.toString(),
            phone: customer?.shipping?.phone?.toString(),
        },
        shipping: {
            first_name: customer?.shipping?.firstName?.toString(),
            last_name: customer?.shipping?.lastName?.toString(),
            address_1: customer?.shipping?.address1?.toString(),
            address_2: customer?.shipping?.address2?.toString(),
            city: customer?.shipping?.city?.toString(),
            state: customer?.shipping?.state?.toString(),
            postcode: customer?.shipping?.postcode?.toString(),
            country: customer?.shipping?.country?.toString(),
            email: customer?.billing?.email?.toString(),
            phone: customer?.shipping?.phone?.toString(),
        },
        line_items: cart?.contents?.nodes?.map((item) => { 
            
            console.log('->', item)
            const decodedId= Number(atob(item.product.node.id).split(':')[1])
            return ({
            product_id: decodedId,
            quantity: item.quantity,
        })}),
        shipping_lines: [
        	{
        		method_id: shipping.split(':')[0],

        	},
        ],
    };

    console.log('----> createWooOrder', data)
    const WooCommerce = new WooCommerceRestApi({
        url: "https://wp.clarksglassworks.com/",
        consumerKey: process.env.WOOCOMMERCE_KEY,
        consumerSecret: process.env.WOOCOMMERCE_SECRET,
        version: 'wc/v3'
      });

    try {
        const response = await WooCommerce.post("orders", data);

        
        return res.status(200).json(response.data);
      } catch (error) {
        console.error(error.response.data);
        return res.status(500).json(error.response.data);
      }


}

export default handler;
