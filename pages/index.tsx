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
			if (window.pageYOffset > 0) {
				setScrollState("scrolling");
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
		} else if (scrollState === "end") {
			setGameboyState(
				menuActive ? zoomInToGameboyStep1State : scrollingGameboyState
			);
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
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
			<HomepageMenu />
			<div className="h-screen bg-black relative">

					<Image src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/dotsbg.gif" alt="" layout="fill" objectFit="cover" className="opacity-50 absolute z-0" />

					<div className="p-8 pt-[150px]">
						<h1 className="text-white text-[60px] leading-[50px] font-vt323">Welcome to Clark's Glassworks</h1>
						<p className="text-xl lg:text-[40px] text-white font-vt323 mt-10">One of Canadae's premier boro glass artists. Looking for a new bong, rig, or dab setup? You've come correct and direct to the source!</p>
					</div>

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

			<ClarkyBoi clarkyBoiState={clarkyBoiState} />

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
