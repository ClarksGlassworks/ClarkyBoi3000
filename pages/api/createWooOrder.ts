// pages/api/createOrder.ts

// import WooCommerceAPI from "woocommerce-api";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

async function handler(req, res) {
	const { cart, firstName, lastName, address, city, state, postcode, country, payPalOrder } =
		req.body;

    console.log('----> createWooOrder', cart)
    const data = {
		payment_method: "bacs",
		payment_method_title: "Direct Bank Transfer",
		set_paid: false,
		billing: {
			first_name: "John",
			last_name: "Doe",
			address_1: "969 Market",
			address_2: "",
			city: "San Francisco",
			state: "CA",
			postcode: "94103",
			country: "US",
			email: "john.doe@example.com",
			phone: "(555) 555-5555",
		},
		shipping: {
			first_name: "John",
			last_name: "Doe",
			address_1: "969 Market",
			address_2: "",
			city: "San Francisco",
			state: "CA",
			postcode: "94103",
			country: "US",
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
				method_id: "flat_rate",
				method_title: "Flat Rate",
				total: "10.00",
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
