import Link from "next/link";
import Casette from "../components/casette";
import Layout from "../components/layout";
import { useGetCart } from "../lib/api";
import Image from "next/legacy/image";
import Head from "next/head";
import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css'; // choose your theme
toastConfig({ theme: 'dark', position: 'bottom-center' }); // configure global toast settings, like theme

import useWindowSize from "../hooks/useWindowSize";
const ShoppingCartPage = ({ preview }) => {

    const { cart, mutate } = useGetCart()
    const { isMobile } = useWindowSize()

    const handleRemoveFromCart = async (key) => {
        console.log('remove from cart')
        const req = await fetch ('/api/removeFromCart?key=' + key)
        const res = await req.json()
        toast('Removed item from your cart')
        mutate()

    }

    console.log({ cart })
    if (!cart) return null
    return (<Layout preview={preview}>

        <Head ><title>Shopping Cart | Clark's Glassworks</title></Head>

        <Casette casetteState={{
            x: "26%",
            y: -40,
            mobileX: 0,
            mobileY: 0,
            rotate: 0,
            scale: isMobile ? 0.8 : 0.5,
            position: "top",
        }} />

        <div className="z-30  absolute   w-auto left-4 right-4  lg:w-[600px]   top-[20%] lg:top-[220px] lg:left-[30px] mx-auto">
            <div className=" bg-white border-2 border-[#ca6707] w-full relative mt-[270px] lg:mt-auto ">
                <div className="w-full  bg-[#fdd5a8] text-[#ca6707] p-2">
                    Your shopping cart!
                </div>
                <div className="mt-2 w-full p-4 over">
                    {cart?.contents.nodes.length === 0 && (<div className="text-center h-[300px] justify-center items-center flex overflow-hidden"><div className="h-[300px] w-full relative z-10"><Image src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/MInL.gif" alt="" fill className="" /></div>
                        <div className="text-white z-20 font-vt323 text-[30px] absolute shadow-xl p-4 rounded-xl">You're coming up bananas bud,<br/> go grab some glass</div></div>)}
                    {cart?.contents.nodes.map((item, index) => {

                        const { quantity, key, subtotal, product: { node: { id, title, stockStatus } } } = item
                        return <div className="flex flex-row justify-between items-center w-full border-b border-[#ca6707] last:border-0 pb-2 mb-2">
                            {stockStatus === 'OUT_OF_STOCK' && (<div className="text-red-500 absolute bg-[rgba(255,255,255,0.9)] w-3/4 text-center font-vt323">Sorry my dude, somebody snagged it!</div>)}
                            {/* <div></div> */}
                            <div className="w-1/3">{title}</div>
                            <div>{quantity}</div>
                            <div>{subtotal}</div>
                            <div><div className="text-blue-500 underline" onClick={()=>{handleRemoveFromCart(key)}}>Remove</div></div>
                        </div>
                    })}
                </div>
                <div className=" border-t border-[#ca6707] justify-end flex flex-col w-full items-end p-4 text-sm">
                    <div className="font-semibold">Totals</div>

                    <div>Subtotal: {cart?.subtotal}</div>
                    <div>Tax: {cart?.totalTax}</div>
                    <div>Total: <span className="text-[#ca6707] font-bold ">{cart?.total}</span></div>
                </div>
                <div className="flex justify-between items-center flex-row border-t border-[#ca6707] p-2 mt-2 ">
                    <div className="text-right text-blue-500 underline cursor-pointer"><Link href="/shop">Continue Shopping</Link></div>
                    <div className="text-right text-blue-500 underline cursor-pointer"><Link href="/checkout">Checkout</Link></div>
                </div>

            </div>
            
            <div className="flex justify-center"> <Image src={'https://wp.clarksglassworks.com/wp-content/uploads/2024/01/giphy-2.gif'} alt="Paypal" width="200" height="50" /></div>
        </div>


    </Layout>);
}

export default ShoppingCartPage;
