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
        const req = await fetch('/api/addToCart?id=' + decodedId + '&quantity=1', { method: 'POST' })
        const res = await req.json()
        if(!res) {
            console.log('Error adding to cart')
        }
        mutate()
        toast('Added your item to the cart')
        setTimeout(() => {
            router.push('/cart')
        }, 2000);
        e.stopPropagation()
    }

    if(!product) return null
    return (
        <div
            onClick={handleAddToCart}
            className="bg-black hover:text-green-400 p-4 text-[14px] lg:text-[20px] text-white text-center rounded-full flex flex-row gap-4 items-center justify-center cursor-pointer relative z-[999]">
            <FaShoppingCart /> {text}
        </div>
    );
}

export default AddToCartButton;
