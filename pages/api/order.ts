// pages/api/createOrder.ts

// import WooCommerceAPI from "woocommerce-api";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

async function handler(req, res) {
    const { id } = req.query;

    console.log(req);
    const WooCommerce = new WooCommerceRestApi({
        url: "https://wp.clarksglassworks.com/",
        consumerKey: process.env.WOOCOMMERCE_KEY,
        consumerSecret: process.env.WOOCOMMERCE_SECRET,
        version: 'wc/v3'
    });

    try {
        const response = await WooCommerce.get(`orders/${id}`);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(error.response.data);
        return res.status(500).json(error.response.data);
    }
}

export default handler;
