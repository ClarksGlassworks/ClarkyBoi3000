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
	useScrollPosition,
	useWooCommerceProducts,
} from "../lib/api";
import { CMS_NAME } from "../lib/constants";
import Top8Friends from "../components/top8friends";
import Casette from "../components/homepage-header";
import Corner from "../components/corner";
import Gamebody from "../components/gameboy";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useWindowSize from "../hooks/useWindowSize";
import { set } from "date-fns";
import Image from "next/legacy/image";
import HomepageHeader from "../components/homepage-header";
import ClarkyBoi from "../components/clarky";
import { useRouter } from "next/router";
import HomepageMenu from "../components/HomepageMenu";
import { FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa";

import { animateScroll as scroll } from 'react-scroll';
export default function Index({ allPosts: { edges }, preview }) {
	const heroPost = edges[0]?.node;
	const morePosts = edges.slice(1);

	const router = useRouter();
	const { isMobile } = useWindowSize();

	const [scrollPosition, setScrollPosition] = useState("initial");

	useEffect(() => {
		if ('scrollRestoration' in history) {
			// Enable scroll restoration
			history.scrollRestoration = 'auto';
		}

		const handleScroll = () => {
			const y = window.scrollY;
			const nearBottom =
				document.documentElement.scrollHeight - (window.innerHeight + 100);

			if (y < 200) {
				setScrollPosition("initial");
			} else if (y >= 200 && y < 700) {
				setScrollPosition("scrolling");
			} else if (y >= 700 && y < 1200) {
				setScrollPosition("scrolling2");
			} else if ((y >= 1200 && y < 1600) || (y > 1600 && y < nearBottom)) {
				setScrollPosition("scrolling3");
			} else if (y >= nearBottom) {
				setScrollPosition("end");
			} else {
				// we seem to have a chunk at the bottom that gets detected
				setScrollPosition("scrolling3");
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// component states
	const initialClarkyBoi2State = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: 1,
	};
	const endClarkyBoi2State = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: 1,
	};
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
	const [clarkyBoi2State, setClarkyBoi2State] = useState(
		initialClarkyBoi2State
	);
	const { scrollYProgress } = useScroll();

	const gameboyRef = useRef(null);
	const casetteRef = useRef(null);



	useEffect(() => {
		window.scrollTo(0, 0);
		return () => {
			scroll.scrollToTop(); // Scroll to the top of the page when the component is unmounted
		  };
	}, []);

	const [key, setKey] = useState(Date.now());

useEffect(() => {
  setKey(Date.now());
}, [router.asPath]);

	useEffect(() => {
		if (router.asPath === "/") {
			setCasetteState(initialCasetteState);
			setHeaderBarState(initialHeaderBarState);
			setClarkyBoiState(initialClarkyBoiState);
		} else {
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
		}
	}, [router.asPath]);

	useEffect(() => {
		if (scrollPosition === "initial") {
			setCasetteState(initialCasetteState);
			setHeaderBarState(initialHeaderBarState);
			setClarkyBoiState(initialClarkyBoiState);
		} else if (scrollPosition === "scrolling") {
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
			setClarkyBoiState(scrollingClarkyBoiState);
			setHasScrolled(true);
		} else if (scrollPosition === "scrolling2") {
			setHeaderBarState(scrollingHeaderBarState);
			setCasetteState(hiddenCasetteState);
		} else if (scrollPosition === "scrolling3") {
			setCasetteState(hiddenCasetteState);
			setHeaderBarState(initialHeaderBarState);
		} else if (scrollPosition === "end") {
			setCasetteState(hiddenCasetteState);
			setHeaderBarState(initialHeaderBarState);
			setHasScrolled(true);
		}
	}, [scrollPosition]);

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
			{(scrollPosition === 'scrolling2' || scrollPosition === 'scrolling3' || scrollPosition === 'end') && (<div className="  backdrop-blur-sm w-full h-screen -z-10 fixed top-0 bottom-0 left-0 right-0"></div>)}
			<Corner scrollState={scrollState} scrollPosition={scrollPosition} />
			<Top8Friends products={products} scrollPosition={scrollPosition} />
			{/* <HomepageMenu /> */}

			<div className="flex flex-col lg:flex-row gap-4 lg:mb-[150px]">
			<div className="h-[600px] bg-black relative mx-4 my-4 border-4 border-black overflow-hidden  mt-16  w-auto lg:w-1/3">
				<Image
					src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/dotsbg.gif"
					alt=""
					layout="fill"
					objectFit="cover"
					className="opacity-50 absolute z-0 blur-sm hue-rotate-90"
				/>
				<ClarkyBoi clarkyBoiState={clarkyBoiState} key={key} scrollPosition={scrollPosition} />
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

			{/* END OF WELCOME */}
			<div
				className="min-h-[600px] bg-black border-4 border-black relative bg-cover bg-repeat bg-center mx-4 my-4 mt-16 lg:w-1/3"
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

			{/* END OF WHOLESALE */}
			<div className="min-h-[600px] bg-gradient-to-b from-teal-600 to-purple-900 relative mx-4 my-4 border-4 border-black  z-20 border-4 border-black  mt-16 lg:w-1/3 ">
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

			{/* END OF CUSTOM */}
			</div>
			
			<div className="min-h-[500px] bg-gradient-to-b from-transparent to-black relative z-0 -mt-[500px]"></div>
			<div className="bg-black min-h-[150px] flex justify-center flex-col">
				<div className="flex flex-row gap-4 mx-auto justify-between w-1/2">
					<FaInstagram className="text-white text-4xl" />
					<FaEnvelope className="text-white text-4xl" />
					<FaFacebook className="text-white text-4xl" />
				</div>
			</div>

			<div className="min-h-[270px] bg-black relative z-0 overflow-hidden">
				<Image
					src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/Zebra-pattern-wallpaper.jpg"
					alt=""
					layout="fill"
					objectFit="cover"
					className="opacity-70 absolute z-0 filter "
				/>
				
					<motion.div
						initial={{ opacity: 0, y: scrollPosition === "end" ? "100%" : "0%", scale: 0.7 }}
						animate={{
							opacity: 1,
							y: scrollPosition === "end" ? "0%" : "80%",
							scale: 0.7,
							transition: { duration: 0.5, type: "spring", damping: 14, stiffness: 100 }
						}}
						exit={{ opacity: 0, y: "100%" }}
						className="scale-[65%] absolute -bottom-[68px] z-20 overflow-hidden"
						transition={{ duration: 0.5 }}
					>
						<Image
							src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/clark-transparent-not-simps.png"
							width="600"
							height="300"
							alt="ClarkyBoi"
							className={`z-20 relative bottom-0 right-0 `}
						/>
					</motion.div>
				
				<div className="min-h-[270px] bg-gradient-to-b to-[rgba(0,0,0,0.7)] from-black relative z-10"></div>
			</div>

			{/* @ts-ignore */}

			<HomepageHeader
				casetteState={casetteState}
				ref={casetteRef}
				isMobile={isMobile}
				headerBarState={headerBarState}
				scrollPosition={scrollPosition}
			/>

			{isMobile && scrollPosition == "initial" && !hasScrolled && (
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
