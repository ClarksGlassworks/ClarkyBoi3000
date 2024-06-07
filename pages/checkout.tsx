import {
    PayPalButtons,
    PayPalScriptProvider,
    usePayPalScriptReducer,
    PayPalHostedField,
} from "@paypal/react-paypal-js";
import Layout from "../components/layout";

import { useForm, Controller } from "react-hook-form";
import { useGetCart, useGetCustomer, useOrder } from "../lib/api";
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
import { FaCreditCard } from "react-icons/fa";

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
    const [showInteract, setShowInteract] = useState(false)
    const [orderTotal, setOrderTotal] = useState(null);
    const [wooOrder, setWooOrder] = useState(null)
    const [shippingRates, setShippingRates] = useState(null);
    const { cart, mutate } = useGetCart();
    const [validShipping, setValidShipping] = useState(false)
    const { customer, mutate: mutateCustomer } = useGetCustomer();
    const { order, mutate: mutateOrder } = useOrder(wooOrderId.current);
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
        getValues,
        trigger, // Add trigger function
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


    useEffect(()=>{

        if(order && order.status === 'processing'){
            console.log('payment was completed')
            
            setShowInteract(false)
            setShowThankYou(true)
            emptyCart()
            setTimeout(()=>{
                document.location = '/'
            },1000)
            // completeWooOrder(wooOrderId.current)
        }

    },[order])

    const onSubmit = (data, actions) => {
        if (!isValid) {
            return false;
        } else {
            updateShippingInfo(formData);
            window.scrollTo(0, document.body.scrollHeight);
            return true;
        }
    };

    const applyShippingRate = async (rate) => {
        const response = await fetch("/api/applyShippingRate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: rate }),
        });

        const applyResponse = await response.json();
        setValidShipping(true)
        mutate();

    };

    useEffect(() => {
        if (customer && cart) {
            // trigger(); // Trigger form validation
        }

        if (cart) {
            // we need to handle when we see a lower shipping rate, for some reason they aren't auto applying anymore
            const availableRates = cart?.availableShippingMethods?.map((method) => {
                return method?.rates?.map((rate) => {
                    return {
                        ...rate,
                    };
                });
            });
            // now we need to find the lowest rate
            const lowestRate = availableRates?.[0]?.reduce((prev, curr) => {
                return prev?.cost < curr?.cost ? prev : curr;
            });

            if(lowestRate?.id){
            applyShippingRate(lowestRate?.id);
            }
        }
    }, [customer, cart]);

    const onInteractSubmit = (data, actions) => { };

    const spinUpListener = async (order) => {

        const data = await fetch("/api/spinUpETransferChecker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                order:order
            }),
        })

        console.log('---------------------------------------------------------------- spin up', data)

        const response = await data.json()
       
        console.log('response',response)
    
    }


    const onDiscountSubmit = async (data, actions) => {
        const response = await fetch("/api/applyCoupon", {
            method: "POST",
            body: JSON.stringify({code:data.discount}),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const applyResponse = await response.json();
        mutate();

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

        trigger();
    }, [customer]);

    async function updateShippingInfo(data) {

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
                setValidShipping(true)
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
            .then((orderData) => { });
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

    async function createWooOrder(cart, method, status) {

        console.log('-> createWooOrder')
        console.log({cart, method, status})
        const rates = cart.availableShippingMethods[0].rates[0]
        console.log({rates})
        const request = await fetch("/api/createWooOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart: cart,
                customer: customer,
                payment_method: method,
                status: status,
            }),
        });

        const data = await request.json();
        if (data) {
            setWooOrder(data)
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

    async function createOrder(data) {
        const { method } = data;

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
                const response = await createWooOrder(cart, method);
                if (response) {
                    updateWooOrderId(response?.id);
                }
                return order.data.id;
            });
    }

    async function handleETransfer() {
        
        // we need to aslo set the order status
    
        createWooOrder(cart, 'bacs','on-hold').then((order) => {
        
        // lets move the order to pending
        // updateWooOrderStatus(order.id, 'pending');
        
        updateWooOrderId(order.id)
        mutateOrder()
        spinUpListener(order)

        setOrderTotal(order.total)
        setShowInteract(true);
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

                const [quickNote, notes, response, doAnEmpty] = await Promise.all([
                    addWooNotes('Paypal payment successful! Order ID: ' + orderData.id),
                    addWooNotes(orderData),
                    completeWooOrder(wooOrderId.current),
                    emptyCart(),
                ]);
                if (quickNote && response && notes && doAnEmpty) {
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
                    {(!showThankYou && !showInteract) && (
                        <>
                            <div className="w-full">
                                <h1 className=" font-vt323 text-[50px]">Checkout</h1>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="font-vt323 text-[30px] pl-2">
                                        Shipping Info
                                    </div>
                                    <div>
                                        <span className="ml-2 text-red-500">*</span> all fields are
                                        required.
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("firstName", { required: true })}
                                            placeholder="First Name"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors.firstName && (
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors.firstName.message}
                                            </span>
                                        )}

                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("lastName", { required: true })}
                                            placeholder="Last Name"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors.lastName && (
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors.lastName.message}
                                            </span>
                                        )}

                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("email", { required: true })}
                                            placeholder="Email"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors.email && (
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors.email.message}
                                            </span>
                                        )}

                                        <div className="pt-4 mx-2 mt-4 border-t border-orange-500"></div>

                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("shipping.address1", { required: true })}
                                            placeholder="Address"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors?.shipping?.address1 && (
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors?.shipping?.address1.message}
                                            </span>
                                        )}

                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("shipping.address2", { required: true })}
                                            placeholder="Addres 2"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors?.shipping?.address2 && (
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors?.shipping?.address2.message}
                                            </span>
                                        )}

                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("shipping.city", { required: true })}
                                            placeholder="City"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors?.shipping?.city && (
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors?.shipping?.city.message}
                                            </span>
                                        )}

                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("shipping.state", { required: true })}
                                            placeholder="State/Province"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors?.shipping?.state && (
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors?.shipping?.state.message}
                                            </span>
                                        )}

                                        <input
                                            className="p-2 m-2 border border-orange-500"
                                            {...register("shipping.postcode", { required: true })}
                                            placeholder="Postal/Zip"
                                            onBlur={handleSubmit(onSubmit)}
                                        />

                                        {errors?.shipping?.postcode && (
                                            <span className="ml-2 text-sm text-red-500">
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
                                                    className="m-2 "
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
                                            <span className="ml-2 text-sm text-red-500">
                                                {errors?.shipping?.country.message}
                                            </span>
                                        )}

                                        {!isValid && (
                                            <button
                                                type="submit"
                                                className="p-2 m-2 mt-4 text-white bg-orange-500 rounded-full"
                                                onClick={handleSubmit(onSubmit)}
                                            >
                                                Update Shipping Info
                                            </button>
                                        )}
                                        <div className="pt-4 mx-2 mt-4 border-t border-orange-500"></div>
                                    </div>
                                </form>

                                <form onSubmit={discountHandleSubmit(onDiscountSubmit)}>
                                    <div className="mt-0 mb-4">
                                        <div>
                                            <input
                                                className="p-2 m-2 border border-orange-500"
                                                {...discountRegister("discount", { required: false })}
                                                placeholder="Discount Code"
                                            />
                                            <button
                                                className="p-2 m-2 border border-orange-500"
                                                type="submit"
                                                onClick={discountHandleSubmit(onDiscountSubmit)}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <div className="w-full mx-2 text-sm text-gray-400">
                                    International shipping is $50. Canadian orders over $300 ship
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
                                        {cart.discountTotal && (
                                            <>
                                                <div className="text-[30px]">Discount</div>
                                                <div className="font-thin text-gray-400 text-[30px]">
                                                    {cart?.discountTotal}
                                                </div>
                                            </>
                                        )}

                                        <div className="text-[30px]">Total</div>
                                        <div className="font-thin text-gray-400 text-[30px]">
                                            {cart?.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {(isValid && cart && customer && validShipping) && (
                                <div className="w-full mx-auto mt-4">
                                    <PayPalButtons
                                        style={{ layout: "vertical", label: "pay" }}
                                        onApprove={onApprove}
                                        createOrder={()=>createOrder({method: 'bacs'})}
                                        //@ts-ignore
                                        // onClick={onClick}
                                        onCancel={cancelOrder}
                                    />

                                    <button
                                        onClick={handleETransfer}
                                        className="flex items-center justify-center w-full gap-2 p-3 text-white transition-all duration-200 bg-pink-500 cursor-pointer hover:bg-purple-500"
                                    >
                                        <FaCreditCard /> Pay with Interact eTransfer
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {showInteract && (
                        <div className="bg-white max-w-[500px] mx-auto p-4 pt-0 mt-[150px] pt-8 font-vt323 text-[30px] leading-[20px] text-orange-500 flex flex-col ">
                            <div className="w-full ">
                                <Image
                                    src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/money.gif"
                                    alt="Thank you"
                                    width="100"
                                    height="100"
                                    className="object-cover w-1/2 h-full mx-auto"
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <div className="text-green-500 leading-[20px] pb-4">Money time!</div> Please send your eTransfer of <span className="text-green-500 underline leading-normal">${orderTotal}</span> to <span className="text-blue-500">sales@clarksglassworks.com</span>, with your order number 
                                     <span className="text-blue-600"> {wooOrder.id}</span> in the notes.<br /><br />Your payment will be automatically deposited and your order will begin processing.<br /> <br /> You will receive an email when the order begins processing.

                                <div className="">
                                    <a
                                        href="../"
                                        className="mt-4 text-sm text-blue-500 underline"
                                    >
                                        Go back to homepage
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {showThankYou && (
                        <div className="bg-white max-w-[500px] mx-auto p-4 pt-0 mt-[150px] pt-8 font-vt323 text-[30px] text-orange-500 flex flex-col lg:flex-row">
                            <div className="w-full lg:w-1/2">
                                <Image
                                    src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/tcrews.gif"
                                    alt="Thank you"
                                    width="200"
                                    height="300"
                                    className="object-cover w-full h-full"
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                    }}
                                />
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="text-green-500">Order Succesful!</div> My d00d,
                                thank you for your support! I will contact you soon with
                                shipping information!
                                <div className="">
                                    <a
                                        href="../"
                                        className="mt-4 text-sm text-blue-500 underline"
                                    >
                                        Go back to homepage
                                    </a>
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
