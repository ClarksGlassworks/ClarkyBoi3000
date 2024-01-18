import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useGetCart } from "../lib/api";
const ShoppingCartButton = () => {
    const { cart } = useGetCart();
    if (cart) {
        return (
            <Link href="/cart">
                <div className={`text-white mr-2 opacity-100 bg-black rounded-full text-center p-2  max-w-[200px] top-10 right-10 fixed px-4 flex flex-row gap-2 items-center cursor-pointer shadow-2xl shadow-black`}>
                    <FaShoppingCart /> {cart?.contents?.productCount === 0 ? 'Cart is empty' : `${cart?.contents?.productCount} item ${cart?.contents?.productCount > 1 ? 's' : ''} in cart`}
                </div>
            </Link>
        );
    }
}

export default ShoppingCartButton;
