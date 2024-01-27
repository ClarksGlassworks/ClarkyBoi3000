// pages/api/product/[id].ts
import withSession from "../../lib/withSession";

async function handler(req, res) {
	const reqBody = req.body;

    const customer = req.body.customer;
	const variables = {
		firstName: reqBody.firstName || reqBody.shipping.firstName,
		lastName: reqBody.lastName || reqBody.shipping.lastName,
		email: reqBody.email || reqBody.shipping.email,
		address1: reqBody.shipping.address1,
		address2: reqBody.shipping.address2,
		city: reqBody.shipping.city,
		state: reqBody.shipping.state,
		postcode: reqBody.shipping.postcode,
		country: reqBody.shipping.country,
	};

	console.log("updateWooSession.ts >", { variables });

    // 

	try {
		const response = await fetch("https://wp.clarksglassworks.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"woocommerce-session": `Session ${
					req.sessionToken ? req.sessionToken : ""
				}`,
			},
			body: JSON.stringify({
				query: `
      
        mutation UpdateUser(
            $address1: String = "",
            $address2: String = "",
            $city: String = "",
            $country: CountriesEnum = AD,
            $email: String = "",
            $lastName: String = "",
            $firstName: String = "",
            $phone: String = "",
            $postcode: String = "",
            $state: String = ""
        ) {
            updateCustomer(
                input: {
                    shipping: {
                        address1: $address1,
                        address2: $address2,
                        city: $city,
                        country: $country,
                        firstName: $firstName,
                        lastName: $lastName,
                        phone: $phone,
                        postcode: $postcode,
                        email: $email,
                        state: $state,
                        overwrite: true
                    },
                    billing: {
                        address1: $address1,
                        address2: $address2,
                        city: $city,
                        country: $country,
                        firstName: $firstName,
                        lastName: $lastName,
                        phone: $phone,
                        postcode: $postcode,
                        email: $email,
                        state: $state,
                        overwrite: true
                    },
                    email: $email,
                }
            ) {
                clientMutationId
                customer {
                    email
                    calculatedShipping
                    hasCalculatedShipping
                    shipping {
                        email
                    }
                }
            }
        }
        `,
				variables,
			}),
		});

		if (!response.ok) {
			console.error("HTTP status:", response.status);
			console.error("Status text:", response.statusText);
			throw new Error("Network response was not ok");
		}

		const responseBody = await response.json();

		if (responseBody.errors) {
			console.error("GraphQL Errors:", responseBody.errors);
			throw new Error("Error in GraphQL query or mutation");
		}

		const { data } = responseBody;

		console.log({ data });

		if (!req.sessionToken) {
			res.setHeader(
				"Set-Cookie",
				`woocommerce-session=${response.headers.get(
					"woocommerce-session"
				)}; HttpOnly`
			);
		}

		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error fetching product" });
	}
}

export default withSession(handler);
