// pages/api/product/[id].ts
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
async function handler(req, res) {
	const { orderID, payment_method } = req.body;
	const data = {
		status: "processing",
        payment_method: payment_method,
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
