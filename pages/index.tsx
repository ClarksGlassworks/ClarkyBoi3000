import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getWooCommerceProduct, getWooCommerceProducts, useWooCommerceProducts } from "../lib/api";
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

	}
	const scrollingClarkyBoiState = {
		x: 0,
		y: 0,
		rotate: 0,
		scale: 1,
	};

	const initialCasetteState = {
		x: 0,
		y: 20,
		mobileX: 0,
		mobileY: 20,
		rotate: 0,
		scale: 1,
	};
	const scrollingCasetteState = {
		x: 0,
		y: 20,
		mobileX: -200,
		mobileY: -80,
		rotate: -20,
		scale: isMobile ? 0.4 : 1,
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
	const [hasScrolled, setHasScrolled] = useState(false)
	const [menuActive, setMenuActive] = useState(false)
	// x = left, y = top
	const [casetteState, setCasetteState] = useState(initialCasetteState);
	const [headerBarState, setHeaderBarState] = useState(initialHeaderBarState);

	// x = right, y = bottom
	const [gameboyState, setGameboyState] = useState(initialGameboyState);
	const [clarkyBoiState, setClarkyBoiState] = useState(initialClarkyBoiState);
	const { scrollYProgress } = useScroll();

	const gameboyRef = useRef(null);
	const casetteRef = useRef(null);
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((v) => {
			if (v === 0) {
				setScrollState("initial");
			} else if (v > 0 && v < 1) {
				setScrollState("scrolling");
			} else if (v === 1) {
				setScrollState("end");
			}
		});

		return () => unsubscribe();
	}, [scrollYProgress]);

	useEffect(() => {
		if (scrollState === "initial") {
			setGameboyState(menuActive ? zoomInToGameboyStep1State : initialGameboyState);
			setCasetteState(initialCasetteState);
			setHeaderBarState(initialHeaderBarState);
			setClarkyBoiState(initialClarkyBoiState);
		} else if (scrollState === "scrolling") {
			setGameboyState(menuActive ? zoomInToGameboyStep1State : scrollingGameboyState);
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
			setClarkyBoiState(scrollingClarkyBoiState);
			setHasScrolled(true)
		} else if (scrollState === "end") {
			setGameboyState(menuActive ? zoomInToGameboyStep1State : scrollingGameboyState);
			setCasetteState(scrollingCasetteState);
			setHeaderBarState(scrollingHeaderBarState);
			setClarkyBoiState(scrollingClarkyBoiState);
			setHasScrolled(true)
		}
	}, [scrollState]);


	useEffect(() => {
		if (menuActive) {
			setGameboyState(zoomInToGameboyStep1State)
		} else {
			setGameboyState(initialGameboyState)
		}
	}, [menuActive])

	// console.log({products})
	return (
		<Layout preview={preview}>
			<Head>
				<title>{`Clark's Glassworks | Canadian Made Bongs, Rigs, Dab Rigs & More`}</title>
			</Head>
			<Corner />
			<Top8Friends products={products} />
			{/* @ts-ignore */}
			<HomepageHeader casetteState={casetteState}
				scrollState={scrollState}
				ref={casetteRef}
				isMobile={isMobile}
				headerBarState={headerBarState}
			/>
			{/* @ts-ignore */}
			<Gamebody gameboyState={gameboyState}
				scrollState={scrollState}
				ref={gameboyRef}
				isMobile={isMobile}
				setMenuActive={setMenuActive}

			/>

			<ClarkyBoi clarkyBoiState={clarkyBoiState}  />

			{isMobile && scrollState == 'initial' && !hasScrolled && (<div className="text-white p-4 rounded-full text-2xl items-center fixed bottom-4 left-1/2 transform translate-x-[-50%] z-[999] opacity-100 w-full">
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
			</div>)}
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
