// pages/api/wooAuth.js
import WooCommerceAPI from 'woocommerce-api';

export default async function handler(req, res) {
  const WooCommerce = new WooCommerceAPI({
    url: 'https://wp.clarksglassworks.com/',
    consumerKey: process.env.WOOCOMMERCE_KEY,
    consumerSecret: process.env.WOOCOMMERCE_SECRET,
    wpAPI: true,
    version: 'wc/v3'
  });

  try {
    const data = await WooCommerce.getAsync('orders');
    res.status(200).json({ message: 'Successfully authenticated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate' });
  }
}
