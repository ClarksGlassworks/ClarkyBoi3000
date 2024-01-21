// pages/api/product/[id].ts
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
async function handler(req, res) {
	const { orderID } = req.body;
	// const variables = { orderID: orderID };
    console.log('cancelWooOrder.ts >', {orderID}, orderID)
	const data = {
		status: "cancelled",
	};

	const WooCommerce = new WooCommerceRestApi({
		url: "https://wp.clarksglassworks.com/",
		consumerKey: process.env.WOOCOMMERCE_KEY,
		consumerSecret: process.env.WOOCOMMERCE_SECRET,
		version: "wc/v3",
	});

	try {
		const response = await WooCommerce.put(`orders/${orderID}`, data);
		return res.status(200).json(response.data);
	} catch (error) {
		console.error(error.response.data);
		return res.status(500).json(error.response.data);
	}
}

export default handler;
