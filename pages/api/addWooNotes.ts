// pages/api/product/[id].ts
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
async function handler(req, res) {
	const { orderID, notes } = req.body;
	var data = {
		note: JSON.stringify(notes.data.result),
	};

	const WooCommerce = new WooCommerceRestApi({
		url: "https://wp.clarksglassworks.com/",
		consumerKey: process.env.WOOCOMMERCE_KEY,
		consumerSecret: process.env.WOOCOMMERCE_SECRET,
		version: "wc/v3",
	});

	try {
		const response = await WooCommerce.post(
			`orders/${orderID}/notes`,
			data,
			function (err, data, res) {
				console.log(res);
			}
		);
		return res.status(200).json(response.data);
	} catch (error) {
		console.error(error.response.data);
		return res.status(500).json(error.response.data);
	}
}

export default handler;
