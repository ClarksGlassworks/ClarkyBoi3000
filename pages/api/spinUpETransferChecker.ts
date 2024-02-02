import withSession from "../../lib/withSession";
import cron from "node-cron";
import { simpleParser } from "mailparser";
import Imap from "node-imap";
import fs from "fs";
import { inspect } from "util";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

let cronJob;

async function handler(req, res) {
	const { order } = req.body;

	const {
		id,
		total,
		status,
		billing: { email },
	} = order;
	
	const WooCommerce = new WooCommerceRestApi({
		url: "https://wp.clarksglassworks.com/",
		consumerKey: process.env.WOOCOMMERCE_KEY,
		consumerSecret: process.env.WOOCOMMERCE_SECRET,
		version: "wc/v3",
	});

	try {
		const checkEmail = async () => {

			console.log("---------------Checking email for Order:" + id + " with total of " + total + " dollars");
			const config = {
				user: "clark@clarksglassworks.com",
				password: "Clark@2024!",
				host: "imap.titan.email",
				port: 993,
				tls: true,
				authTimeout: 60000,
			};

			const connection = new Imap(config);

			// console.log("Connecting to email server...");
			// console.log("Connection:", connection)

			connection.once("ready", () => {
				// console.log("Connection ready");
				connection.openBox("INBOX", (err, box) => {
					if (err) {
						console.log("Error opening inbox")
						// console.error(err);
						return;
					}

					var today = new Date();
					today.setHours(0, 0, 0, 0);
					var searchCriteria = [["SENTON", today], ["SUBJECT", "INTERAC"]];

					const fetchOptions = {
						bodies: ["HEADER", "TEXT", ""],
					};

					connection.search(searchCriteria, (err, results) => {
						if (err) {
							console.log('-------------- nothing matching the search criteria found')
							// console.error(err);
							return;
						}

						if (results.length === 0) {
							console.log('No emails found that match the search criteria');
							return;
						}


						const fetchOptions = {
							bodies: ["HEADER", "TEXT", ""],
						};

						const f = connection.fetch(results, fetchOptions);

						f.on("message", (msg) => {
							msg.on("body", (stream) => {
								simpleParser(stream, async (err, parsed) => {
									if (err) {

										console.log("Error parsing email")
										// console.error(err);
										return;
									}

									const { text } = parsed;
									if (text) {
										const regex = /Message:\n(\d+)/;
										const match = text.match(regex);
										let referenceNumber = '';
										if (match) {
											const messageNumber = match[1];
											console.log("Order Number", messageNumber);
											// Do something with the message number
										}
										const regexAmount = /amount of \$(\d+\.\d{2}) \(CAD\)/;
										const matchAmount = text.match(regexAmount);
										if (matchAmount) {
											const dollarAmount = parseFloat(matchAmount[1]);
											// Do something with the dollar amount
										}
										// lets pull out the reference number for the notes
										const regexReference = /Reference Number: ([\w\d]+)/;
										const matchReference = text.match(regexReference);
										if (matchReference) {
											referenceNumber = matchReference[1];
										}
										const matches = text.includes(id) && text.includes(total);
										// const matches = true
										if(matches) {
											console.log("Found a match!");
											// check to make sure the order is not already cancelled
											const {status } = await WooCommerce.get(`orders/${id}`)
											if(status == "cancelled") {
												console.log("Order is already cancelled - stopping cron job");
												cronJob.stop();
												return;
											}

											// lets update the order status
											const data = {
												status: "processing",
											};
											try {
												await Promise.all([
													WooCommerce.put(`orders/${id}`, data),
													WooCommerce.post(`orders/${id}/notes`, {
														note: "E-Transfer payment received - Reference Number: " + referenceNumber,
													}),
												]);
												cronJob.stop();
											} catch (error) {
												console.error('---->', error.response.data);
											}
										} else {
											console.log("No match found for Order " + id + " with " + total + " dollars");
										}

									}
								});
							});
						});

						f.once("error", function (err) {
							console.log("Fetch error: " + err);
						});

						f.once("end", async function () {
							console.log("Done fetching all messages!");
							console.log("Cancelling unpaid order...");

							// const {status } = await WooCommerce.get(`orders/${id}`)

							// const data = {
							// 	status: "cancelled",
							// };
							// try {
							// 	if(status == "on-hold") {
							// 	await Promise.all([
							// 		WooCommerce.put(`orders/${id}`, data),
							// 	]);
							// 	}
							// } catch (error) {
							// 	console.error('---d-d-d-d-', error.response.data);
							// }
							connection.end();
						});
					});
				});
			});

			connection.connect();
		};

		// Schedule the cron job to run every 60 seconds
		const cronJob = cron.schedule("*/1 * * * *", checkEmail);
		setTimeout(() => {
			WooCommerce.put(`orders/${id}`, {status:"cancelled"});
			cronJob.stop();
		}, 60 * 60 * 1000);
		res.status(200).json({ status: "success", message: "Cron job started" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: "Error fetching product" });
	}
}

export default withSession(handler);
