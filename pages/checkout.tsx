import {
    PayPalButtons,
    PayPalScriptProvider,
    usePayPalScriptReducer,
    PayPalHostedField,
} from "@paypal/react-paypal-js";
import Layout from "../components/layout";

import { useForm } from "react-hook-form";
import { useGetCart } from "../lib/api";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import Casette from "../components/casette";
import useWindowSize from "../hooks/useWindowSize";
import { set } from "date-fns";
import Link from "next/link";
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
    const { cart, mutate } = useGetCart();
    const { isMobile } = useWindowSize();

    const updateWooOrderId = (id) => {
        wooOrderId.current = id;
      };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const {
        register: discountRegister,
        handleSubmit: discountHandleSubmit,
        formState: { errors: discountErrors, isValid },
    } = useForm();
    useEffect(() => {

        if (wooOrderId) console.log('wooOrderId set', wooOrderId)

    }, [wooOrderId])
    console.log({ cart });
    const onSubmit = (data, actions) => {
        if (!isValid) {
            actions.disable();
            alert("Please complete the form before proceeding.");
            return false;
        }
    };


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
                mutate()
                return "empty"
                // we don't really care about the results, this is just used to clean up orders that aren't paid for
                // console.log("Clear result", orderData);
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
                return noteData
                // we don't really care about the results, this is just used to clean up orders that aren't paid for
                // console.log("Add Notes result", orderData);
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
                // we don't really care about the results, this is just used to clean up orders that aren't paid for
                // console.log("Cancel result", orderData);
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

                console.log('Woo Order Completed', orderData)
                // we don't really care about the results, this is just used to clean up orders that aren't paid for
                // console.log("Complete result", orderData);
                return orderData
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
            }),
        })

        const data = await request.json()

        if (data) {
            // we don't need to do anything after the order is created. We just need to make sure it's created
            return data
        }

    }

    const cancelOrder = useCallback(async (data) => {
        // This is called when the buyer cancels the PayPal checkout before completing the payment
        if (wooOrderId) {
            cancelWooOrder(wooOrderId);
        }
    }, [wooOrderId]);

    useEffect(() => {
        // This will cause the PayPalButtons component to re-render whenever wooOrderId changes
    }, [cancelOrder]);
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
                const response = await createWooOrder(cart)
                if (response) {
                    updateWooOrderId(response?.id);
                }
                return order.data.id;
            });
    }

    function onClick(data) {
        console.log("onClick", data);
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

                console.log('Payment Completed', orderData)

                const [ notes, response, doAnEmpty ] = await Promise.all([addWooNotes(orderData), completeWooOrder(wooOrderId.current), emptyCart()])
                if (response && notes && doAnEmpty) {
                    emptyCart()
                    setShowThankYou(true);
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
                <div className="bg-white max-w-[500px] mx-auto p-4 pt-0 mt-[150px]">
                    {isPending ? <div className="spinner" /> : null}
                    {!showThankYou && (<><div className="w-full">
                        <h1 className=" font-vt323 text-[50px]">Checkout</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="font-vt323 text-[30px] pl-2">Shipping Info</div>
                            <div>
                                <span className="text-red-500 ml-2">*</span> all fields are
                                required.
                            </div>
                            <div className="flex flex-col">
                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("first_name", { required: true })}
                                    placeholder="First Name"
                                />

                                {errors.first_name && <span>This field is required</span>}
                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("last_name", { required: true })}
                                    placeholder="Last Name"
                                />
                                {errors.last_name && <span>This field is required</span>}

                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("email", { required: true })}
                                    placeholder="Email"
                                />
                                {errors.email && <span>This field is required</span>}
                                <div className="border-t border-orange-500 pt-4 mt-4 mx-2"></div>
                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("address", { required: true })}
                                    placeholder="Address"
                                />
                                {errors.address && <span>This field is required</span>}
                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("city", { required: true })}
                                    placeholder="City"
                                />
                                {errors.city && <span>This field is required</span>}
                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("state", { required: true })}
                                    placeholder="State/Province"
                                />
                                {errors.state && <span>This field is required</span>}
                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("postal", { required: true })}
                                    placeholder="Postal/Zip"
                                />
                                {errors.postal && <span>This field is required</span>}
                                <input
                                    className="border m-2 border-orange-500 p-2"
                                    {...register("country", { required: true })}
                                    placeholder="Country"
                                />
                                {errors.country && <span>This field is required</span>}

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
                            International shipping is $50. Canadian orders over $150 ship for
                            FREE! Please enter your shipping information above for accurate
                            shipping rates.
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
                    <div className="mt-4 w-full mx-auto">
                        <PayPalButtons
                            style={{ layout: "vertical", label: "pay" }}
                            onApprove={onApprove}
                            createOrder={createOrder}
                            onClick={onClick}
                            onCancel={cancelOrder}
                        />
                    </div></>)}

                    {showThankYou && (  <div className="bg-white max-w-[500px] mx-auto p-4 pt-0 mt-[150px] pt-8 font-vt323 text-[30px] text-orange-500"><div className="text-green-500">Order Succesful!</div> My d00d, thank you for your support! I will contact you soon with shipping information!<div className=""><Link href='../'>Go back to homepage</Link></div></div>)}

                </div>
            </Layout>
        );
    }
};

export default CheckoutPage;
