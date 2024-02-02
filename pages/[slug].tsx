import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";

import Header from "../components/header";

import PostTitle from "../components/post-title";

// import { CMS_NAME } from "../../lib/constants";

import Product from "../components/product";
import Image from "next/image";

import AddToCartButton from "../components/add-to-cart";

import useWindowSize from "../hooks/useWindowSize";
import ShoppingCartButton from "../components/shoppingCartButton";
import { FaArrowLeft, FaBackward } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import HomepageHeader from "../components/homepage-header";
import { motion, useScroll } from "framer-motion";
export default function Post({ product, preview }) {

	const router = useRouter();
	// const morePosts = posts?.edges;
	const { isMobile } = useWindowSize();
	const { scrollY, scrollYProgress } = useScroll();
	const initialCasetteState = {
		x: -200,
		y: -80,
		mobileX: -170,
		mobileY: -60,
		rotate: -20,
		scale: 0.5,
	};
	const scrollingCasetteState = {
		x: -200,
		y: -80,
		mobileX: -180,
		mobileY: -80,
		rotate: -20,
		scale: 0.4,
		// scale: isMobile ? 0.4 : 1,
	};

	const initialHeaderBarState = { x: 0, y: 0, rotate: 0, scale: 1, height: 50 };
	const scrollingHeaderBarState = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: 1,
		height: 100,
	};
	const [casetteState, setCasetteState] = useState(initialCasetteState);
	const [headerBarState, setHeaderBarState] = useState(initialHeaderBarState);
const [selectedImage, setSelectedImage] = useState(product ? product.image.sourceUrl : null);
const allImages = product ? [
    product.image.sourceUrl,
    ...product.galleryImages.nodes.map((image) => image.sourceUrl),
] : [];
	const [images, setImages] = useState(allImages);

	const casetteRef = useRef(null);

	useEffect(() => {
		window.scrollY = 0;
		window.scrollTo(0, 0);
	}, [router.asPath]);

	useEffect(() => {
		if (router.asPath === "/") {
			setCasetteState(initialCasetteState);
			setHeaderBarState(initialHeaderBarState);
		} else {
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
		}
	}, [router.asPath]);

	if (!router.isFallback && !product) {
		return <ErrorPage statusCode={404} />;
	}

	return (
        <Product preview={preview}>
			<Header />
			{router.isFallback ? (
				<PostTitle>Loading…</PostTitle>
			) : (
				<>
					<Head>
						<title>{`${product.name} | Clark's Glassworks`}</title>
						<meta
							property="og:image"
							content={product.image?.node?.sourceUrl}
						/>
					</Head>
					<div className="  backdrop-blur-sm w-full h-screen -z-10 fixed "></div>
					<article className=" m-4 mt-0 lg:m-0 max-w-screen-xl pt-[180px] mb-[150px] mx-4 lg:mx-auto">
						<HomepageHeader
							//@ts-ignore
							casetteState={casetteState}
							ref={casetteRef}
							isMobile={isMobile}
							headerBarState={headerBarState}
							scrollPosition={"scrolling"}
						/>
						{/* <Casette casetteState={{
							x: "0%",
							y: -40,
							mobileX: -170,
							mobileY: -60,
							rotate: -20,
							scale: 0.5,
							position: "top",
							zIndex: 9999,
						}} /> */}
						<ShoppingCartButton />
						<div className="relative mx-auto border-4 border-white">
							<div className=" z-10 aspect-square bg-black w-full border-b-8 border-white shadow-2xl shadow-black overflow-hidden flex justify-center">
								<motion.div
									className="aspect-square overflow-hidden w-full"
									key={images[0]} // Add the key prop
									initial={{ opacity: 0 }} // Start from transparent
									animate={{ opacity: 1 }} // Animate to fully visible
									transition={{ duration: 0.5 }} // Duration of the transition
								>
									<Image
                                        // Use the first image in the array as the main image
                                        src={images[0]}
                                        alt={product.name}
                                        width="500"
                                        height="500"
                                        className="object-cover w-full h-full aspect-square"
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto"
                                        }} />
								</motion.div>
							</div>
							<div className="absolute z-20 text-[40px] font-semibold text-white p-4  leading-none bottom-[10px]">
								<h1 className="">{product.name}</h1>{" "}
								
							</div>
							<div
								className="absolute top-4 left-4 bg-white rounded-full p-2"
								onClick={() => {
									router.back();
								}}
							>
								<FaArrowLeft />
							</div>
							{product.price && (
								<div className="absolute z-20 text-[20px] font-semibold text-white bg-black rounded-full p-2 right-[20px] top-[20px]">
									{product.price}
								</div>
							)}


						</div>

						<div className="relative w-full flex flex-row gap-2 mt-2 "> {/* Add items-center */}
							{images?.slice(1).map((imageUrl, index) => {
								return (
									<motion.div
										className="aspect-square overflow-hidden w-1/3 border-4 border-white"
										onClick={() => {
											// Move the clicked image to the start of the array when it's clicked
											const newImages = [
												imageUrl,
												...images.filter((_, i) => i !== index + 1),
											];
											setImages(newImages);
										}}
										whileTap={{ scale: 0.95 }} // Add the whileTap prop
									>
										<Image
											src={imageUrl}
											alt={product.name}
											width="300"
											height="300"
											className="object-cover w-full h-full aspect-square"
											key={index}
											style={{
												maxWidth: "100%",
												height: "auto"
											}} />
									</motion.div>
								);
							})}
						</div>
						{product.description && (
									<div
										className="text-md font-thin bg-white text-black p-4 mt-4 dangerousHTML"
										dangerouslySetInnerHTML={{ __html: product.description }}
									></div>
								)}
					</article>

					<div className="w-full px-4 fixed bottom-[20px] mx-auto left-0 right-0 max-w-screen-xl">
						<AddToCartButton
							text="Add to cart"
							product={product}
						/>
					</div>
				</>
			)}
		</Product>
    );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {


	const response = await fetch("https://wp.clarksglassworks.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
			query ($slug: ID!) {
			  product(id: $slug, idType: SLUG) {
				id
				name
				slug
				description
				isRestricted
				purchasable
				shortDescription
				image {
				  id
				  sourceUrl
				}
				galleryImages {
				  nodes {
					sourceUrl
				  }
				}
				... on ProductWithPricing {
				  price
				  regularPrice
				  salePrice
				}
				... on InventoriedProduct {
					id
					stockQuantity
					stockStatus
				  }
			  }
			}
		  `,
			variables: {
				slug: params.slug,
			},
		}),
	});

	const { data } = await response.json();

	return {
		props: {
			product: data?.product,
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	
	const response = await fetch("https://wp.clarksglassworks.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
                query {
                    products(first: 10000) {
                    edges {
                        node {
                        id
                        name
                        slug
                        purchasable
                        image {
                            id
                            sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
                        }
                        ... on ProductWithPricing {
                            price
                            regularPrice
                            salePrice
                        }
                        }
                    }
                  }
                }
                `,
		}),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const { data } = await response.json();
	const paths =
		data.products.edges
			.map((product) => {
				return product.node;
			})
			.reverse()
			.map((product) => `/${product.slug}`) || [];
	return {
		paths: paths,
		fallback: true,
	};
};
