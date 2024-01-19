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

async function getBearerToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');

  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.access_token;
}


async function createOrder() {
    const token = await getBearerToken();

    return fetch("/api/create-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            order_price: 999,
        }),
    })
        .then((response) => response.json())
        .then((order) => {
            // Your code here after create the order

            console.log('order', order)
            return order.data.id;
        });
}

function onClick(data) {
    console.log('onClick', data)


}
async function onApprove(data) {
    // replace this url with your server

    console.log('onApprove', data)
    const token = await getBearerToken();
    console.log('------> APPROVE, now capture')
    return fetch("/api/capture-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            orderID: data.orderID,
        }),
    })
        .then((response) => response.json())
        .then((orderData) => {
            // Your code here after capture the order
            console.log("Capture result", orderData)
        });
}
const CheckoutPage = ({ preview }) => {



    const [{ isPending }] = usePayPalScriptReducer();
    const { cart } = useGetCart();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const {
        register: discountRegister,
        handleSubmit: discountHandleSubmit,
        formState: { errors: discountErrors },
    } = useForm();

    console.log({ cart });
    const onSubmit = (data) => {
        console.log(data);

    }

    return (
        <Layout preview={preview}>
            <Head><title>Check Out | Clark's Glassworks</title></Head>
            <div className="bg-white max-w-[500px] mx-auto p-4 pt-0 mt-8">
                {isPending ? <div className="spinner" /> : null}
                <div className="w-full">
                    <h1 className=" font-vt323 text-[50px]">Checkout</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="font-vt323 text-[30px]">Shipping Info</div>

                        <div className="flex flex-col">
                            <input
                                className="border m-2 border-orange-500 p-2"
                                {...register("name", { required: true })}
                                placeholder="Name"
                            />
                            {errors.name && <span>This field is required</span>}
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
                        </div>
                    </form>

                    <form onSubmit={discountHandleSubmit(onSubmit)}>
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
                    </form>
                    <div className=" font-vt323 text-[20px] flex flex-row gap-4  justify-between m-2 w-full">
                        <div>
                            <div>Shipping</div>
                            <div className="font-thin text-gray-400">
                                {cart?.shippingTotal}
                            </div>
                            <div>Tax</div>
                            <div className="font-thin text-gray-400">{cart?.subtotalTax}</div>
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
                    <PayPalButtons style={{ layout: "vertical", label: "pay" }} onApprove={onApprove} createOrder={createOrder} onClick={onClick} />
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPage;
