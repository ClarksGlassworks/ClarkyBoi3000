import { useEffect, useState } from "react";
import Casette from "../components/casette";
import Container from "../components/container";
import Layout from "../components/layout";
import { useGetCart, useWooCommerceProducts } from "../lib/api";
import AddToCartButton from "../components/add-to-cart";
import ShoppingCartButton from "../components/shoppingCartButton";
import Head from "next/head";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowSize from "../hooks/useWindowSize";
const Shop = ({ preview }) => {
	// const [products, setProducts] = useState(null)
	// const { cart, mutate } = useGetCart()
	const { products } = useWooCommerceProducts();
    const { isMobile } = useWindowSize()
	return (
		<Layout preview={preview}>
            
			<Head>
				<title>Shop all Glass | Clark's Glassworks</title>
			</Head>
           
			<div>
				<ShoppingCartButton />
			</div>
			<div>
				<Casette
					casetteState={{
						x: "26%",
						y: -40,
						mobileX: 0,
						mobileY: 0,
						rotate: 0,
						scale: 0.5,
						position: "top",
					}}
				/>
			</div>

			<div className="w-full max-w-screen-lg mx-auto mt-[150px] mb-[150px]">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-auto lg:w-full mx-4 lg:mx-0 ">
					{products?.map((product) => {
						return (
							
								<div className="bg-white rounded-lg">
                                    <Link
								href={`/${product.slug}`}
								key={product.id}
							>
									<img
										src={product.image.sourceUrl}
										alt=""
										className="rounded-t-lg"
									/>
									<h1
										className="text-2xl lg:text-4xl font-vt323 p-4 pb-0 underline"
										style={{ minHeight: isMobile ? "4.5em":"3.8em" }}
									>
										{product.name}
										<div>
											<div className="text-xl lg:text-2xl font-vt323 text-green-600">
												{product.price}
											</div>
										</div>
									</h1>
                                    </Link>
									{product.purchasable && (
										<div className="p-4">
											<AddToCartButton
												text={"Add to cart"}
												product={product}
											/>
										</div>
									)}
									{!product.purchasable && (
										<div className="p-4">
											<div className=" text-gray-400 p-4 rounded-lg text-center text-xs">
												Hasn't dropped yet or somebody snagged it!
											</div>
										</div>
									)}
								</div>
							
						);
					})}
				</div>
			</div>
		</Layout>
	);
};

export default Shop;
