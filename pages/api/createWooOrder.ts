// pages/api/createOrder.ts

// import WooCommerceAPI from "woocommerce-api";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

async function handler(req, res) {
    const { cart, customer:customerData, payment_method, status, coupon_lines } =
        req.body;

    const customer = customerData.customer
    const shipping = cart



    const items = cart?.contents?.nodes?.map((item) => {

        // console.log('--->item', item)
        const decodedId= Number(atob(item.product.node.id).split(':')[1])
        // console.log('---->decodedId', decodedId)
        return ({
        product_id: decodedId,
        // item_id: item.product.node.id,
        quantity: item.quantity,
        // subtotal: item.subtotal,
        // subtotalTax: item.subtotalTax,
        // tax: item.tax,
        // total: item.total,
    })})


    const chosen = cart?.chosenShippingMethods[0]
    const theShipping = cart.availableShippingMethods[0].rates.find(r=>r.id === chosen)
    const coupons = cart?.appliedCoupons
   
    console.log('ITEMS --->', items)
    const data = {
        payment_method: payment_method,
        payment_method_title: "Direct Bank Transfer",
        set_paid: false,
        first_name: customer?.shipping?.firstName?.toString(),
        last_name: customer?.shipping?.lastName?.toString(),
        email: customer?.billing?.email?.toString(),
        status: status?.toString(),
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
        line_items: items,
        shipping_lines: [
        	{
        		method_id:theShipping.instanceId,
                total: theShipping.cost,
                method_title: theShipping.label,

        	},
        ],
        coupon_lines: coupons,
    };

    console.log('-----> createWooOrder')
    // console.log(theShipping)
    console.log(data.line_items)
    // console.log({data});
    const WooCommerce = new WooCommerceRestApi({
        url: "https://wp.clarksglassworks.com/",
        consumerKey: process.env.WOOCOMMERCE_KEY,
        consumerSecret: process.env.WOOCOMMERCE_SECRET,
        version: 'wc/v3'
      });

    try {
        const response = await WooCommerce.post("orders", data);

        console.log(response, response.data)


        
        return res.status(200).json(response.data);
      } catch (error) {
        console.error(error.response.data);
        return res.status(500).json(error.response.data);
      }


}

export default handler;
