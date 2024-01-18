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
const Shop = ({ preview }) => {
	// const [products, setProducts] = useState(null)
	// const { cart, mutate } = useGetCart()
	const { products } = useWooCommerceProducts();

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
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full ">
					{products?.map((product) => {
						return (
							<Link
								href={`/${product.slug}`}
								key={product.id}
							>
								<div className="bg-white rounded-lg">
									<img
										src={product.image.sourceUrl}
										alt=""
										className="rounded-t-lg"
									/>
									<h1
										className="text-4xl font-vt323 p-4 pb-0"
										style={{ minHeight: "3.8em" }}
									>
										{product.name}
										<div>
											<div className="text-2xl font-vt323 text-green-600">
												{product.price}
											</div>
										</div>
									</h1>

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
							</Link>
						);
					})}
				</div>
			</div>
		</Layout>
	);
};

export default Shop;
