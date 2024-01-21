import { FaShoppingCart } from "react-icons/fa";
import { addToCart, useGetCart } from "../lib/api";
import { useRouter } from "next/router";
import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css'; // choose your theme

toastConfig({ theme: 'dark', position: 'top-center' }); // configure global toast settings, like theme

const AddToCartButton = ({ text, product }) => {

    const { id } = product
    const router = useRouter()
    const { mutate } = useGetCart()

    const handleAddToCart = async (e) => {

        const decodedId = Number(atob(id).split(':')[1]);
        const req = await fetch('/api/addToCart', { method: 'POST', body: JSON.stringify({ id: decodedId, quantity: 1 }) })
        const res = await req.json()
        if (!res) {
            console.log('Error adding to cart')
        }
        mutate()
        toast('Added your item to the cart')
        setTimeout(() => {
            router.push('/cart')
        }, 2000);
        e.stopPropagation()
    }

    if (!product) return null
    return (
        <>
            {(product?.purchasable && product?.stockStatus !== "OUT_OF_STOCK") && (
                <div
                    onClick={handleAddToCart}
                    className="bg-black hover:text-green-400 p-4 text-[14px] lg:text-[20px] text-white text-center rounded-full flex flex-row gap-4 items-center justify-center cursor-pointer relative z-[999]">
                    <FaShoppingCart /> {text}
                </div>
            )}
            {(!product?.purchasable && product?.stockStatus == "IN_STOCK") && (
                <div className="w-full px-4  bottom-[20px] mx-auto left-0 right-0 max-w-screen-xl">
                    <div className=" text-gray-400 p-4 rounded-full text-center text-xs bg-[rgba(0,0,0,0.2)] text-white">
                        Hasn't dropped yet!
                    </div>
                </div>
            )}
            {product?.stockStatus == 'OUT_OF_STOCK' && (
                <div className="w-full px-4  bottom-[20px] mx-auto left-0 right-0 max-w-screen-xl">
                    <div className=" text-gray-400 p-4 rounded-full text-center text-xs bg-[rgba(0,0,0,0.2)] text-white">
                        Somebody snagged it!
                    </div>
                </div>
            )}

        </>

    );
}

export default AddToCartButton;
