import withSession from "../../lib/withSession";
async function handler(req, res) {

    try {
      
      
      const response = await fetch('https://wp.clarksglassworks.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'woocommerce-session': `Session ${req.sessionToken ? req.sessionToken : ''}`,
        },
        body: JSON.stringify({
          query: `
          query GetCart {
            cart(recalculateTotals: true) {
              isEmpty
              needsShippingAddress
              subtotal
              total
              subtotalTax
              contents {
                nodes {
                  product {
                    node {
                      id
                      title
                      onSale
                      purchasable
                      slug
                      sku
                      type
                      ... on InventoriedProduct {
                        stockStatus
                        stockQuantity
                      }
                      featuredImage {
                        node {
                          sourceUrl
                          sizes(size: WOOCOMMERCE_THUMBNAIL)
                        }
                      }
                      shippingClasses {
                        nodes {
                          id
                          name
                        }
                      }
                    }
                  }
                  quantity
                  subtotal
                  subtotalTax
                  tax
                  total
                  key
                }
                productCount
              }
              discountTax
              discountTotal
              shippingTotal
              shippingTax
              totalTax
              appliedCoupons {
                code
                description
                discountAmount
                discountTax
              }
              availableShippingMethods {
                rates {
                  cost
                  id
                  instanceId
                  label
                  methodId
                }
                packageDetails
                supportsShippingCalculator
              }
              chosenShippingMethods
            }
          }
          `
        }),
      });
  
      if (!req.sessionToken) {
        res.newSessionToken = response.headers.get('woocommerce-session');
      }
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const { data } = await response.json();
  
      res.status(200).json(data.cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching product' });
    }
  }
  

  export default withSession(handler);
