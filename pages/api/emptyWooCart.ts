import withSession from "../../lib/withSession";
async function handler(req, res) {
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
                mutation MyMutation {
                    emptyCart(input: {clearPersistentCart: true}) {
                      clientMutationId
                    }
                  }
          `,
			}),
		});

		if (!req.sessionToken) {
			res.newSessionToken = response.headers.get("woocommerce-session");
		}

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const responseBody = await response.json();
		if (responseBody.errors) {
			console.error("GraphQL Errors:", responseBody.errors);
			throw new Error("Error in GraphQL query or mutation");
		}

		const { data } = responseBody;

		res.status(200).json({ status: "success" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error fetching product" });
	}
}

export default withSession(handler);
