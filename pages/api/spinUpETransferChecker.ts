import withSession from "../../lib/withSession";
import cron from "node-cron";
import { simpleParser } from "mailparser";
import Imap from "node-imap";
import fs from "fs";
import { inspect } from "util";

let cronJob;

async function handler(req, res) {
	const { order } = req.body;

	const {
		id,
		total,
		status,
		billing: { email },
	} = order;

	try {
		const checkEmail = async () => {
			const config = {
				user: "clark@clarksglassworks.com",
				password: "Clark@2024!",
				host: "imap.titan.email",
				port: 993,
				tls: true,
				authTimeout: 3000,
			};

			const connection = new Imap(config);

			console.log("Connecting to email server...");
			// console.log("Connection:", connection)

			connection.once("ready", () => {
				console.log("Connection ready");
				connection.openBox("INBOX", (err, box) => {
					if (err) {
						console.error(err);
						return;
					}

					var searchCriteria = [["SUBJECT", "INTERAC"]];

					const fetchOptions = {
						bodies: ["HEADER", "TEXT", ""],
					};

					connection.search(searchCriteria, (err, results) => {
						if (err) {
							console.error(err);
							return;
						}

						console.log("Results", results.length);
						const fetchOptions = {
							bodies: ["HEADER", "TEXT", ""],
						};

						const f = connection.fetch(results, fetchOptions);

						f.on("message", (msg) => {
							msg.on("body", (stream) => {
								simpleParser(stream, async (err, parsed) => {
									//   console.log(parsed);

									// we now need to search the parsed text
									// for the order number
									// and the amount

									const { text } = parsed;

									console.log("Text", text);
									// const orderNumber = text.match(/(.*)/)[1];
									// const amount = text.match(/(.*)/)[1];

									// console.log("Order Number", orderNumber);
									// console.log("Amount", amount);

									// if(orderNumber || amount) {
									// 	// this is likely a match
									// 	// lets go back and update the order in woo to set to paid

									// }


								});
							});
						});

						f.once("error", function (err) {
							console.log("Fetch error: " + err);
						});

						f.once("end", function () {
							console.log("Done fetching all messages!");
							connection.end();
						});
					});
				});
			});

			connection.connect();
		};

		// Schedule the cron job to run every 60 seconds
		// cronJob = cron.schedule("*/60 * * * * *", checkEmail);

		checkEmail();

		res.status(200).json({ status: "success", message: "Cron job started" });

		// ...
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: "Error fetching product" });
	}
}

export default withSession(handler);
