import { FaShoppingCart } from "react-icons/fa";
import { addToCart, useGetCart } from "../lib/api";
import { useRouter } from "next/router";

const AddToCartButton = ({ text, product }) => {
    const { id } = product
    // console.log({ product })

    const router = useRouter()
    // const { mutate } = useGetCart()
    const { mutate } = useGetCart()
       

    
    const handleAddToCart = async (e) => {


        console.log('add to cart')
        // e.stopPropagation()

        const decodedId = Number(atob(id).split(':')[1]);
        // console.log({ decodedId })
        // const result = await addToCart(decodedId, 1);


        const req = await fetch('/api/addToCart?id=' + decodedId + '&quantity=1', { method: 'POST' })
        const res = await req.json()
        console.log({ res })
        // console.log({ result })
        if(!res) {
            console.log('Error adding to cart')
        }

        router.push('/cart')
        // addToCart(decodedId, 1);
        // mutate()
        // alert('Added to cart')
    }

    if(!product) return null
    return (
        <div
            onClick={handleAddToCart}
            className="bg-black hover:text-green-400 p-4 text-[20px] text-white text-center rounded-full flex flex-row gap-4 items-center justify-center cursor-pointer relative z-[999]">
            <FaShoppingCart /> {text}
        </div>
    );
}

export default AddToCartButton;
