import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import {
	getWooCommerceProduct,
	getWooCommerceProducts,
	useWooCommerceProducts,
} from "../lib/api";
import { CMS_NAME } from "../lib/constants";
import Top8Friends from "../components/top8friends";
import Casette from "../components/homepage-header";
import Corner from "../components/corner";
import Gamebody from "../components/gameboy";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import useWindowSize from "../hooks/useWindowSize";
import { set } from "date-fns";
import Image from "next/image";
import HomepageHeader from "../components/homepage-header";
import ClarkyBoi from "../components/clarky";
import { useRouter } from "next/router";
import HomepageMenu from "../components/HomepageMenu";
import { FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Index({ allPosts: { edges }, preview }) {
	const heroPost = edges[0]?.node;
	const morePosts = edges.slice(1);

	const { isMobile } = useWindowSize();

	// component states

	const initialClarkyBoiState = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: 1,
	};
	const scrollingClarkyBoiState = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: 1,
	};
	const hiddenCasetteState = {
		x: 0,
		y: -80,
		mobileX: -170,
		mobileY: -300,
		rotate: -20,
		scale: isMobile ? 0.5 : 0.6,
		opacity: 0,
	};
	const initialCasetteState = {
		x: 0,
		y: -80,
		mobileX: -170,
		mobileY: -60,
		rotate: -20,
		scale: isMobile ? 0.5 : 0.6,
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

	const initialGameboyState = {
		x: -20,
		y: -70,
		rotate: 20,
		scale: isMobile ? 0.8 : 1,
	};
	const scrollingGameboyState = {
		x: -100,
		y: -150,
		rotate: 20,
		scale: isMobile ? 0.5 : 1,
	};
	const zoomInToGameboyStep1State = {
		x: isMobile ? 30 : 400,
		y: isMobile ? 180 : -250,
		rotate: 0,
		scale: isMobile ? 2.1 : 4,
	};

	const zoomInToGameboyStep2State = {
		x: -100,
		y: -150,
		rotate: 20,
		scale: isMobile ? 0.5 : 1,
	};

	const initialHeaderBarState = { x: 0, y: 0, rotate: 0, scale: 1, height: 50 };
	const scrollingHeaderBarState = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: 1,
		height: 100,
	};

	const products = edges.map(({ node }) => node).reverse();
	const [isScrolled, setIsScrolled] = useState(false);
	const [scrollState, setScrollState] = useState("initial");
	const [hasScrolled, setHasScrolled] = useState(false);
	const [menuActive, setMenuActive] = useState(false);
	const [casetteState, setCasetteState] = useState(initialCasetteState);
	const [headerBarState, setHeaderBarState] = useState(initialHeaderBarState);
	const [gameboyState, setGameboyState] = useState(initialGameboyState);
	const [clarkyBoiState, setClarkyBoiState] = useState(initialClarkyBoiState);
	const { scrollYProgress } = useScroll();

	const gameboyRef = useRef(null);
	const casetteRef = useRef(null);

	const router = useRouter();
	useEffect(() => {
		window.scrollTo(0, 0);
		// setScrollState("initial");
	}, []);

	useEffect(() => {
		const handleWindowScroll = () => {
			if (window.pageYOffset > 0 && window.pageYOffset <= 600) {
				setScrollState("scrolling");
			} else if (window.pageYOffset > 600 && window.pageYOffset <= 1200) {
				setScrollState("scrolling2");
			} else if (window.pageYOffset > 1200) {
				setScrollState("scrolling3");
			} else {
				setScrollState("initial");
			}
		};

		window.addEventListener("scroll", handleWindowScroll);

		return () => {
			window.removeEventListener("scroll", handleWindowScroll);
		};
	}, []);

	useEffect(() => {
		if (router.asPath === "/") {
			setCasetteState(initialCasetteState);
			setHeaderBarState(initialHeaderBarState);
		} else {
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
		}
	}, [router.asPath]);

	useEffect(() => {
		console.log({ scrollState });
		if (scrollState === "initial") {
			setGameboyState(
				menuActive ? zoomInToGameboyStep1State : initialGameboyState
			);
			setCasetteState(initialCasetteState);
			setHeaderBarState(initialHeaderBarState);
			setClarkyBoiState(initialClarkyBoiState);
		} else if (scrollState === "scrolling") {
			setGameboyState(
				menuActive ? zoomInToGameboyStep1State : scrollingGameboyState
			);
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
			setClarkyBoiState(scrollingClarkyBoiState);
			setHasScrolled(true);
		} else if (scrollState === "scrolling2") {
			setHeaderBarState(scrollingHeaderBarState);
			setCasetteState(hiddenCasetteState);
		} else if (scrollState === "scrolling3") {
			setCasetteState(hiddenCasetteState);

			setHeaderBarState(initialHeaderBarState);
		} else if (scrollState === "end") {
			setGameboyState(
				menuActive ? zoomInToGameboyStep1State : scrollingGameboyState
			);

			setCasetteState(hiddenCasetteState);
			setHeaderBarState(initialHeaderBarState);
			setClarkyBoiState(scrollingClarkyBoiState);
			setHasScrolled(true);
		}
	}, [scrollState]);

	useEffect(() => {
		if (menuActive) {
			setGameboyState(zoomInToGameboyStep1State);
		} else {
			setGameboyState(initialGameboyState);
		}
	}, [menuActive]);

	// console.log({products})
	return (
		<Layout preview={preview}>
			<Head>
				<title>{`Clark's Glassworks | Canadian Made Bongs, Rigs, Dab Rigs & More`}</title>
			</Head>
			<Corner scrollState={scrollState} />
			<Top8Friends products={products} />
			{/* <HomepageMenu /> */}
			<div className="h-[600px] bg-black relative mx-4 my-4 border-4 border-black overflow-hidden">
				<Image
					src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/dotsbg.gif"
					alt=""
					layout="fill"
					objectFit="cover"
					className="opacity-50 absolute z-0 blur-sm hue-rotate-90"
				/>
				<ClarkyBoi clarkyBoiState={clarkyBoiState} />
				<div className="p-8 pt-[50px] relative z-10">
					<h1 className="text-white text-[55px] leading-[40px] font-vt323">
						Welcome to Clark's Glassworks
					</h1>
					<p className="text-xl lg:text-[40px] text-white font-vt323 mt-10 pr-[40px]">
						One of Canada's premier boro glass artists. Looking for a new bong,
						rig, or dab setup? You've come correct and direct to the source!
					</p>
				</div>
			</div>

			<div
				className="min-h-[600px] bg-black border-4 border-black relative bg-cover bg-repeat bg-center mx-4 my-4"
				style={{
					backgroundImage:
						"url('https://wp.clarksglassworks.com/wp-content/uploads/2024/01/MIkl.gif')",
					backgroundSize: "300px 300px",
					backgroundRepeat: "repeat",
				}}
			>
				<div className="p-8 pt-[150px] relative z-20">
					<h1 className="text-white text-[55px] leading-[40px] font-honk">
						Wholesale boss?
					</h1>
					<div className="mt-2">
						<span className="text-xl lg:text-[40px] text-white font-vt323 mt-10 bg-black leading-[18px] p-1">
							Lets make some cheddar together! I offer wholesale pricing on all
							my work to brick and mortar shops.
						</span>
					</div>

					<div className="flex flex-col gap-2">
						<button className="p-4 bg-pink-500 text-white mt-4 w-[180px]">
							Download Catalog
						</button>
						<button className="p-4 text-pink-500 text-lg mt-2 bg-[rgba(255,255,255,1)] w-[180px]">
							Make 'n order
						</button>
					</div>
				</div>
			</div>

			<div className="min-h-[600px] bg-gradient-to-b from-teal-600 to-purple-900 relative mx-4 my-4 border-4 border-black  z-20 border-4 border-black ">
				<Image
					src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/triangle-bg.gif"
					alt=""
					layout="fill"
					objectFit="cover"
					className="opacity-20 absolute z-0 filter blur-sm "
				/>

				<Image
					src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/clark-custom-w-1.png"
					alt=""
					width="200"
					height="300"
					objectFit="cover"
					className="opacity-100 absolute bottom-0 right-0 z-10 filter w-[250px] "
				/>

				<div className="p-8 pt-[50px] relative z-20">
					<h1 className="text-white text-[75px] leading-[60px] font-vt323">
						Want a custom?
					</h1>
					<p className="text-xl lg:text-[40px] text-white font-vt323 mt-4">
						Yeah I do that! I love making custom pieces.
					</p>
					<button className="p-4 text-black text-lg mt-2 bg-white w-[180px]">
						Make 'n order
					</button>
				</div>
			</div>

			<div className="min-h-[500px] bg-gradient-to-b from-transparent to-black relative z-0 -mt-[500px]"></div>
			<div className="bg-black min-h-[150px] flex justify-center flex-col">
				<div className="flex flex-row gap-4 mx-auto justify-between w-1/2">
					<FaInstagram className="text-white text-4xl" />
					<FaEnvelope className="text-white text-4xl" />
					<FaFacebook className="text-white text-4xl" />
				</div>
			</div>

			<div className="min-h-[200px] bg-black relative z-0">
				<Image
					src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/Zebra-pattern-wallpaper.jpg"
					alt=""
					layout="fill"
					objectFit="cover"
					className="opacity-70 absolute z-0 filter "
				/>
				<div className="min-h-[200px] bg-gradient-to-b to-[rgba(0,0,0,0.7)] from-black relative z-10"></div>
			</div>
			{/* @ts-ignore */}

			<HomepageHeader
				casetteState={casetteState}
				scrollState={scrollState}
				ref={casetteRef}
				isMobile={isMobile}
				headerBarState={headerBarState}
			/>
			{/* @ts-ignore */}
			{/* <Gamebody gameboyState={gameboyState}
				scrollState={scrollState}
				ref={gameboyRef}
				isMobile={isMobile}
				setMenuActive={setMenuActive}

			/> */}

		

			{isMobile && scrollState == "initial" && !hasScrolled && (
				<div className="text-white p-4 rounded-full text-2xl items-center fixed bottom-4 left-1/2 transform translate-x-[-50%] z-[999] opacity-100 w-full">
					<div className="flex flex-row items-center bg-black rounded-full justify-center mx-10 p-2">
						<div className="flex-shrink-0">
							<Image
								src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/giphy-1.gif"
								alt=""
								width={50}
								height={50}
								className=""
							/>
						</div>
						<div className="whitespace-nowrap">Swipe up to scroll</div>
					</div>
				</div>
			)}
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
	const allPosts = await getWooCommerceProducts({ featured: true });

	return {
		props: { allPosts, preview },
		revalidate: 10,
	};
};
