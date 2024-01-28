import {
	PayPalButtons,
	PayPalScriptProvider,
	usePayPalScriptReducer,
	PayPalHostedField,
} from "@paypal/react-paypal-js";
import Layout from "../components/layout";

import { useForm, Controller } from "react-hook-form";
import { useGetCart, useGetCustomer } from "../lib/api";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import Casette from "../components/casette";
import useWindowSize from "../hooks/useWindowSize";
import { set } from "date-fns";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import Image from "next/image";

const countryOptions = [
	{ value: "US", label: "United States" },
	{ value: "CA", label: "Canada" },
	// Add more countries as needed
];

const schema = yup.object().shape({
	firstName: yup.string().required("First name is required."),
	lastName: yup.string().required("Last name is required."),
	email: yup
		.string()
		.email("Invalid email address.")
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address.")
		.required("Email is required."),
	shipping: yup.object().shape({
		address1: yup
			.string()
			.required("Address is required.")
			.matches(/^[a-zA-Z0-9\s]+$/, "Invalid address format."),
		address2: yup.string().nullable(), // Allow address2 to be nullable
		city: yup
			.string()
			.required("City is required.")
			.matches(/^[a-zA-Z\s]+$/, "Invalid city format."),
		state: yup
			.string()
			.required("Province/State is required.")
			.matches(/^[a-zA-Z\s]+$/, "Invalid province/state format."),
		postcode: yup
			.string()
			.required("Postal code is required.")
			.matches(
				/^(?:[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d|\d{5}(?:[-\s]\d{4})?)$/,
				"Invalid postal code format."
			),
		country: yup.string().required("Country is required."),
	}),
});

async function getBearerToken() {
	const clientId = process.env.PAYPAL_CLIENT_ID;
	const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

	const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

	const data = new URLSearchParams();
	data.append("grant_type", "client_credentials");

	const response = await fetch(
		"https://api-m.sandbox.paypal.com/v1/oauth2/token",
		{
			method: "POST",
			headers: {
				Authorization: `Basic ${auth}`,
				Accept: "application/json",
				"Accept-Language": "en_US",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: data,
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const json = await response.json();
	return json.access_token;
}

const CheckoutPage = ({ preview }) => {
	// const [wooOrderId, setWooOrderId] = useState(null);

	const wooOrderId = useRef(null);

	const [paypalOrderId, setPaypalOrderId] = useState(null);
	const [orderData, setOrderData] = useState(null);
	const [payment, setPayment] = useState(null);
	const [{ isPending }] = usePayPalScriptReducer();
	const [showThankYou, setShowThankYou] = useState(false);
	const [shippingRates, setShippingRates] = useState(null);
	const { cart, mutate } = useGetCart();
	const { customer, mutate: mutateCustomer } = useGetCustomer();
	const { isMobile } = useWindowSize();

	const updateWooOrderId = (id) => {
		wooOrderId.current = id;
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, dirtyFields },
		watch,
		control,
		setValue,
	} = useForm({
		// mode: "onBlur",
		resolver: yupResolver(schema),
	});
	const {
		register: discountRegister,
		handleSubmit: discountHandleSubmit,
		formState: { errors: discountErrors },
	} = useForm();

	const formData = watch();


	const onSubmit = (data, actions) => {
		if (!isValid) {
			return false;
		} else {
			updateShippingInfo(formData);
			window.scrollTo(0, document.body.scrollHeight);
			return true;
		}
	};

	useEffect(() => {
		if (cart) {
			// lets get the rates and set them
			const rates = cart?.availableShippingMethods?.map((method) => {
				method?.rates?.map((rate) => {
					return {
						...rate,
					};
				});
			});
			setShippingRates(rates);
		}
	}, [cart]);

	useEffect(() => {
		const custy = customer?.customer;
		// we need to update the form values
		const { shipping, billing } = custy || {};
		for (const key in custy) {
            //@ts-ignore
			setValue(`${key}`, shipping[key]);
		}
		for (const key in shipping) {
            //@ts-ignore
			setValue(`shipping.${key}`, shipping[key]);
		}
		for (const key in billing) {
            //@ts-ignore
			setValue(`billing.${key}`, billing[key]);
			if (key === "email") {
				setValue("email", billing[key]);
			}
		}
	}, [customer]);

	async function updateShippingInfo(data) {
		console.log("update shipping info", data);

		return await fetch("/api/updateWooSession", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...data,
			}),
		})
			.then((response) => response.json())
			.then((orderData) => {
				mutate();
				mutateCustomer();
				return orderData;
			});
	}

	async function emptyCart() {
		return await fetch("/api/emptyWooCart", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				orderID: wooOrderId.current,
			}),
		})
			.then((response) => response.json())
			.then((orderData) => {
				mutate();
				return "empty";
			});
	}

	async function addWooNotes(notes) {
		return await fetch("/api/addWooNotes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				orderID: wooOrderId.current,
				notes: notes,
			}),
		})
			.then((response) => response.json())
			.then((noteData) => {
				return noteData;
			});
	}
	async function cancelWooOrder(orderID) {
		return await fetch("/api/cancelWooOrder", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				orderID: wooOrderId.current,
			}),
		})
			.then((response) => response.json())
			.then((orderData) => {
			});
	}

	async function completeWooOrder(orderID) {
		return await fetch("/api/completeWooOrder", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				orderID: wooOrderId.current,
			}),
		})
			.then((response) => response.json())
			.then((orderData) => {
				return orderData;
			});
	}

	async function createWooOrder() {
		const request = await fetch("/api/createWooOrder", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cart: cart,
				customer: customer,
			}),
		});

		const data = await request.json();
		if (data) {
			return data;
		}
	}

	const cancelOrder = useCallback(
		async (data) => {
			if (wooOrderId) {
				cancelWooOrder(wooOrderId);
			}
		},
		[wooOrderId]
	);

	async function createOrder() {
		const token = await getBearerToken();
		return fetch("/api/create-order", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				order_price: parseFloat(cart?.total.replace("$", "")),
			}),
		})
			.then((response) => response.json())
			.then(async (order) => {
                //@ts-ignore
				const response = await createWooOrder(cart);
				if (response) {
					updateWooOrderId(response?.id);
				}
				return order.data.id;
			});
	}

	async function onApprove(data) {
		const token = await getBearerToken();
		return fetch("/api/capture-order", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				orderID: data.orderID,
			}),
		})
			.then((response) => response.json())
			.then(async (orderData) => {
				console.log("Payment Completed", orderData);

				const [notes, response, doAnEmpty] = await Promise.all([
					addWooNotes(orderData),
					completeWooOrder(wooOrderId.current),
					emptyCart(),
				]);
				if (response && notes && doAnEmpty) {
					setShowThankYou(true);
					window.scrollTo(0, 0);
				}
				setPaypalOrderId(orderData.id);
				return orderData.id;
			});
	}

	if (!cart) {
		<>Loading...</>;
	}
	if (cart) {
		return (
			<Layout preview={preview}>
				<Head>
					<title>Check Out | Clark's Glassworks</title>
				</Head>
				<Casette
					casetteState={{
						x: "-10%",
						y: -40,
						mobileX: -190,
						mobileY: -90,
						rotate: -20,
						scale: isMobile ? 0.4 : 0.4,
						position: "top",
						zIndex: 9999,
					}}
				/>
				<div className="bg-white max-w-[500px] mx-4 lg:mx-auto p-4 pt-0 mt-[120px] lg:mt-[150px] mb-[150px] ">
					{isPending ? <div className="spinner" /> : null}
					{!showThankYou && (
						<>
							<div className="w-full">
								<h1 className=" font-vt323 text-[50px]">Checkout</h1>
								<form onSubmit={handleSubmit(onSubmit)}>
									<div className="font-vt323 text-[30px] pl-2">
										Shipping Info
									</div>
									<div>
										<span className="text-red-500 ml-2">*</span> all fields are
										required.
									</div>
									<div className="flex flex-col">
										<input
											className="border m-2 border-orange-500 p-2"
											{...register("firstName", { required: true })}
											placeholder="First Name"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors.firstName && (
											<span className="text-sm text-red-500 ml-2">
												{errors.firstName.message}
											</span>
										)}

										<input
											className="border m-2 border-orange-500 p-2"
											{...register("lastName", { required: true })}
											placeholder="Last Name"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors.lastName && (
											<span className="text-sm text-red-500 ml-2">
												{errors.lastName.message}
											</span>
										)}

										<input
											className="border m-2 border-orange-500 p-2"
											{...register("email", { required: true })}
											placeholder="Email"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors.email && (
											<span className="text-sm text-red-500 ml-2">
												{errors.email.message}
											</span>
										)}

										<div className="border-t border-orange-500 pt-4 mt-4 mx-2"></div>

										<input
											className="border m-2 border-orange-500 p-2"
											{...register("shipping.address1", { required: true })}
											placeholder="Address"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors?.shipping?.address1 && (
											<span className="text-sm text-red-500 ml-2">
												{errors?.shipping?.address1.message}
											</span>
										)}

										<input
											className="border m-2 border-orange-500 p-2"
											{...register("shipping.address2", { required: true })}
											placeholder="Addres 2"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors?.shipping?.address2 && (
											<span className="text-sm text-red-500 ml-2">
												{errors?.shipping?.address2.message}
											</span>
										)}

										<input
											className="border m-2 border-orange-500 p-2"
											{...register("shipping.city", { required: true })}
											placeholder="City"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors?.shipping?.city && (
											<span className="text-sm text-red-500 ml-2">
												{errors?.shipping?.city.message}
											</span>
										)}

										<input
											className="border m-2 border-orange-500 p-2"
											{...register("shipping.state", { required: true })}
											placeholder="State/Province"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors?.shipping?.state && (
											<span className="text-sm text-red-500 ml-2">
												{errors?.shipping?.state.message}
											</span>
										)}

										<input
											className="border m-2 border-orange-500 p-2"
											{...register("shipping.postcode", { required: true })}
											placeholder="Postal/Zip"
											onBlur={handleSubmit(onSubmit)}
										/>

										{errors?.shipping?.postcode && (
											<span className="text-sm text-red-500 ml-2">
												{errors?.shipping?.postcode.message}
											</span>
										)}
										<Controller
											name="shipping.country"
											control={control}
											defaultValue=""
											rules={{ required: true }}
											render={({ field }) => (
												<Select
													{...field}
													options={countryOptions}
													isClearable
													placeholder="Country"
													onChange={(value) => field.onChange(value?.value)}
													className=" m-2"
													value={countryOptions.find(
														(option) => option.value === field.value
													)}
													styles={{
														control: (provided) => ({
															...provided,
															border: "1px solid orange",
														}),
													}}
												/>
											)}
										/>
										{errors?.shipping?.country && (
											<span className="text-sm text-red-500 ml-2">
												{errors?.shipping?.country.message}
											</span>
										)}

										{!isValid && (
											<button
												type="submit"
												className="mt-4 rounded-full bg-orange-500 text-white p-2 m-2"
												onClick={handleSubmit(onSubmit)}
											>
												Update Shipping Info
											</button>
										)}
										<div className="border-t border-orange-500 pt-4 mt-4 mx-2"></div>
									</div>
								</form>

								{/* <form onSubmit={discountHandleSubmit(onSubmit)}>
							<div className="mt-4">
								<div>
									<input
										className="border m-2 border-orange-500 p-2"
										{...discountRegister("discount", { required: false })}
										placeholder="Discount Code"
									/>
									<button
										className="border m-2 border-orange-500 p-2"
										type="submit"
									>
										Apply
									</button>
								</div>
							</div>
						</form> */}
								<div className="w-full text-gray-400 text-sm mx-2">
									International shipping is $50. Canadian orders over $150 ship
									for FREE! Please enter your shipping information above for
									accurate shipping rates.
								</div>
								<div className=" font-vt323 text-[20px] flex flex-row gap-4  justify-between m-2 w-full">
									<div>
										<div>Shipping</div>
										<div className="font-thin text-gray-400">
											{cart?.shippingTotal}
										</div>
										<div>Tax</div>
										<div className="font-thin text-gray-400">
											{cart?.subtotalTax}
										</div>
									</div>
									<div className="w-1/2">
										<div className="text-[30px]">Total</div>
										<div className="font-thin text-gray-400 text-[30px]">
											{cart?.total}
										</div>
									</div>
								</div>
							</div>
							{isValid && cart && customer && (
								<div className="mt-4 w-full mx-auto">
									<PayPalButtons
										style={{ layout: "vertical", label: "pay" }}
										onApprove={onApprove}
										createOrder={createOrder}
                                        //@ts-ignore
										// onClick={onClick}
										onCancel={cancelOrder}
									/>
								</div>
							)}
						</>
					)}

					{showThankYou && (
						<div className="bg-white max-w-[500px] mx-auto p-4 pt-0 mt-[150px] pt-8 font-vt323 text-[30px] text-orange-500 flex flex-row">
							<div className="w-1/2">
								<Image
									src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/tcrews.gif"
									alt="Thank you"
									width="200"
									height="300"
									className="object-cover w-full h-full"
								/>
							</div>
							<div className="w-1/2">
								<div className="text-green-500">Order Succesful!</div> My d00d,
								thank you for your support! I will contact you soon with
								shipping information!
								<div className="">
									<Link
										href="../"
										className="mt-4 underline text-sm text-blue-500"
									>
										Go back to homepage
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</Layout>
		);
	}
};

export default CheckoutPage;
