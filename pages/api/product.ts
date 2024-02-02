// pages/api/product/[id].ts

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await fetch('https://wp.clarksglassworks.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ($slug: ID!) {
            product(id: $slug, idType: SLUG) {
              id
              name
              slug
              description
              purchasable
              shortDescription
              image {
                id
                sourceUrl
              }
              galleryImages {
                nodes {
                  sourceUrl
                }
              }
              ... on ProductWithPricing {
                price
                regularPrice
                salePrice
              }
              status
              ... on InventoriedProduct {
                id
                stockQuantity
                stockStatus
              }
            }
          }
        `,
        variables: {
          slug: id,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { data } = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching product' });
  }
}
