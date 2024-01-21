// pages/api/products.ts

export default async function handler(req, res) {
	try {
		const response = await fetch("https://wp.clarksglassworks.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
                query {
                    products(first: 10000) {
                    edges {
                        node {
                        id
                        name
                        slug
                        purchasable
                        image {
                            id
                            sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
                        }
                        ... on ProductWithPricing {
                            price
                            regularPrice
                            salePrice
                        }
                        ... on InventoriedProduct {
                            stockStatus
                          }
                        }
                    }
                  }
                }
                `,
                    }),
                });

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const { data } = await response.json();

		res.status(200).json(data.products.edges.map((product) => { return product.node; }).reverse());
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error fetching products" });
	}
}
