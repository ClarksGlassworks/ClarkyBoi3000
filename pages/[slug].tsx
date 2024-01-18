import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import Container from "../components/container";
import PostBody from "../components/post-body";
// import MoreStories from "../../components/more-stories";
import Header from "../components/header";
import PostHeader from "../components/post-header";
// import SectionSeparator from "../../components/section-separator";
// import Layout from "../../components/layout";
import PostTitle from "../components/post-title";
import Tags from "../components/tags";
import {
	getWooCommerceProduct,
	getWooCommerceProducts,
	useWooCommerceProduct,
	useWooCommerceProducts,
} from "../lib/api";
// import { CMS_NAME } from "../../lib/constants";
import Layout from "../components/layout";
import Product from "../components/product";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../components/add-to-cart";
import Casette from "../components/casette";
import useWindowSize from "../hooks/useWindowSize";
import ShoppingCartButton from "../components/shoppingCartButton";
import { FaArrowLeft, FaBackward } from "react-icons/fa";
export default function Post({ product, preview }) {
	const router = useRouter();
	// const morePosts = posts?.edges;
	const { isMobile } = useWindowSize();

	if (!router.isFallback && !product?.slug) {
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

						<Casette casetteState={{
							x: "0%",
							y: -40,
							mobileX: -190,
							mobileY: -90,
							rotate: -20,
							scale: isMobile ? 0.4 : 0.8,
							position: "top",
							zIndex: 9999,
						}} />
						<ShoppingCartButton />
						<div className="relative mx-auto border-4 border-white">
							<div className=" z-10 h-[50vh] bg-green-400 w-full border-b-8 border-white shadow-2xl shadow-black">
								<Image
									src={product.image?.sourceUrl}
									alt={product.name}
									width="500"
									height="300"
									className="object-cover w-full h-full"
								/>
							</div>
							<div className="absolute z-20 text-[40px] font-semibold text-white p-4  leading-none bottom-[10px]">
								<h1 className="">{product.name}</h1>{" "}
								{product.description && (
									<div
										className="text-[25px] font-thin "
										dangerouslySetInnerHTML={{ __html: product.description }}
									></div>
								)}
							</div>
							<div className="absolute top-4 left-4 bg-white rounded-full p-2" onClick={() => { router.back() }}><FaArrowLeft /></div>
							{product.price && (
								<div className="absolute z-20 text-[20px] font-semibold text-white bg-black rounded-full p-2 right-[20px] top-[20px]">
									{product.price}
								</div>
							)}

						</div>

						<div className="relative w-full flex flex-row gap-2 mt-2">
							{product.galleryImages?.nodes?.map((image, index) => {
								return (
									<div className="aspect-square overflow-hidden w-1/3 border-4 border-white">
										<Image
											src={image?.sourceUrl}
											alt={product.name}
											width="300"
											height="300"
											className="object-cover w-full h-full"
											key={index}
										/>
									</div>
								);
							})}
						</div>

					</article>
					{product?.purchasable && (
						<div className="w-full px-4 fixed bottom-[20px] mx-auto left-0 right-0 max-w-screen-xl">
							<AddToCartButton text="Add to cart" product={product} />
						</div>
					)}
					{!product?.purchasable && (
						<div className="w-full px-4 fixed bottom-[20px] mx-auto left-0 right-0 max-w-screen-xl">
							<div className=" text-gray-400 p-4 rounded-full text-center text-xs bg-[rgba(0,0,0,0.5)]">
								Hasn't dropped yet or somebody snagged it!
							</div>
						</div>
					)}

				</>
			)}
		</Product>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	console.log('-------- GET STATIC PROPS -----------')


	// const serverURL = process.env.SERVER_URL
	// const url = `${serverURL}/api/product?id=${params.slug}`


	// if(params.slug == '/cart' || params.slug == '/shop' || params.slug == '/checkout'){
	// 	console.log('---------->>>>>>>', params.slug)
	// }

	// const response = await fetch(url, {
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	});
	// const data = await response.json();

	const response = await fetch('https://wp.clarksglassworks.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
			query ($slug: ID!) {
			  product(id: $slug, idType: SLUG) {
				id
				name
				slug
				description
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
		revalidate: 10,
	};

};

export const getStaticPaths: GetStaticPaths = async () => {
	// const allPosts = await getWooCommerceProducts({ featured: null });
	// console.log({ allPosts });
	// const paths = allPosts?.edges?.map(({ node }) => `/${node.slug}`) || [];
	// console.log('Paths-', { paths });

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
	const paths = data.products.edges.map((product) => { return product.node; }).reverse().map((product) => `/${product.slug}`) || [];
	return {
		paths: paths,
		fallback: true,
	};
};
