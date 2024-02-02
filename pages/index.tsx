import Head from "next/head";
import { GetStaticProps } from "next";

import Layout from "../components/layout";
import {

	getWooCommerceProducts,

} from "../lib/api";

import Top8Friends from "../components/top8friends";
import Corner from "../components/corner";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import useWindowSize from "../hooks/useWindowSize";
import Image from "next/image";
import HomepageHeader from "../components/homepage-header";
import ClarkyBoi from "../components/clarky";
import { useRouter } from "next/router";
import { FaDashcube, FaEnvelope, FaFacebook, FaInstagram, FaMinusSquare, FaXingSquare } from "react-icons/fa";
import { PiXSquareDuotone, PiMinusSquareDuotone } from "react-icons/pi";
import { animateScroll as scroll } from 'react-scroll';
export default function Index({ allPosts: { edges }, preview }) {
	const heroPost = edges[0]?.node;
	const morePosts = edges.slice(1);

	const router = useRouter();
	const { isMobile } = useWindowSize();
	const  { scrollY, scrollYProgress } = useScroll();

	const [scrollPosition, setScrollPosition] = useState("initial");
	const [scrollPercentage, setScrollPercentage] = useState(0);
	const [remainingSpace, setRemainingSpace] = useState(0);

	useEffect(() => {
		if ('scrollRestoration' in history) {
			// Enable scroll restoration
			history.scrollRestoration = 'auto';
		}

		const handleScroll = () => {
			const y = window.scrollY;
			const nearBottom =
				document.documentElement.scrollHeight - (window.innerHeight + 100);


			const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
			const yPercent = Math.round(( y / pageHeight) * 100);

			if (yPercent >= 80 && yPercent <= 100) {
				const remainingSpace = 100 - yPercent;
				const screenPercentage = Math.round((remainingSpace / 20) * 100);
				setRemainingSpace(screenPercentage)
			}

			setScrollPercentage(yPercent)
			// console.log({y, yPercent})
			if (y < 200) {
				setScrollPosition("initial");
			} else if (y >= 200 && y < 900) {
				setScrollPosition("scrolling");
			} else if (y >= 900 && y < 1400) {
				setScrollPosition("scrolling2");
			} else if ((y >= 1400 && y < 1900) || (y > 1900 && y < nearBottom)) {
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

	// const yPos = document.documentElement.getBoundingClientRect().top;
// const scrollPercentage = Math.round((Math.abs(yPos) / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
// console.log(scrollPercentage, yPos, window.scrollY);
	const translateXValue = scrollPercentage.toFixed(2); // Adjust the decimal places as needed
	// const transformStyle = `translateX(${scrollPercentage.toFixed(2)}px)`;


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
	const [showContactForm, setShowContactForm] = useState(false);
	const [clarkyBoi2State, setClarkyBoi2State] = useState(
		initialClarkyBoi2State
	);

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
				<meta
							property="og:image"
							content={'https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png'}
						/>
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
                    className="opacity-50 absolute z-0 blur-sm hue-rotate-90"
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: "cover"
                    }} />
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
						<button className="p-4 text-pink-500 text-lg mt-2 bg-[rgba(255,255,255,1)] w-[180px]" onClick={()=>setShowContactForm(true)}>
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
                    className="opacity-20 absolute z-0 filter blur-sm "
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: "cover"
                    }} />

<AnimatePresence>
	<Image
		src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/clark-custom-w-1.png"
		alt=""
		width="200"
		height="300"
		className="opacity-100 absolute bottom-0 right-0 z-10 filter w-[250px] transition-all duration-500 ease-in-out"
		style={{
			maxWidth: "100%",
			height: "auto",
			objectFit: "cover",
				// transform: `translateX(-${remainingSpace}px)`,
				// transition: 'transform 0.3s ease-in-out' // Adjust the duration and easing as needed
		}}
	/>
</AnimatePresence>

				<div className="p-8 pt-[50px] relative z-20">
					<h1 className="text-white text-[75px] leading-[60px] font-vt323">
						Want a custom?
					</h1>
					<p className="text-xl lg:text-[40px] text-white font-vt323 mt-4">
						Yeah I do that! I love making custom pieces.
					</p>
					<button className="p-4 text-black text-lg mt-2 bg-white w-[180px]" onClick={()=>setShowContactForm(true)}>
						Make 'n order
					</button>
				</div>
			</div>

			{/* END OF CUSTOM */}
			</div>
			
			<div className="min-h-[500px] bg-gradient-to-b from-transparent to-black relative z-0 -mt-[500px]"></div>
			<div className="bg-black min-h-[150px] flex justify-center flex-col">
				<div className="flex flex-row gap-4 mx-auto justify-between w-1/2">
					<a href="https://www.instagram.com/clarksglassworks" target="_blank" rel="noopener noreferrer">
						<FaInstagram className="text-white text-4xl" />
					</a>
					<a href="mailto:sales@clarksglassworks.com">
						<FaEnvelope className="text-white text-4xl" />
					</a>
					<a href="https://www.facebook.com/clark.matthews" target="_blank" rel="noopener noreferrer">
						<FaFacebook className="text-white text-4xl" />
					</a>
				</div>
			</div>

			<div className="min-h-[270px] bg-black relative z-0 overflow-hidden">
				<Image
                    src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/Zebra-pattern-wallpaper.jpg"
                    alt=""
                    className="opacity-70 absolute z-0 filter "
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: "cover"
                    }} />
				
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
                            style={{
                                maxWidth: "100%",
                                height: "auto",
                                objectFit: "cover"
                            }} />
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
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    objectFit: "cover"
                                }} />
						</div>
						<div className="whitespace-nowrap">Swipe up to scroll</div>
					</div>
				</div>
			)}


{showContactForm && (
<motion.div initial={{ opacity: 0 }}
											animate={{ opacity: showContactForm ? 1 : 0 }}
											transition={{ duration: 0.5 }} className="fixed z-[9999] backdrop-blur-sm w-full h-full bg-[rgba(0,0,0,0.5)] left-0 right-0 bottom-0 top-0">
										<motion.div
											
											className="flex flex-col items-center justify-center h-full px-8"
										>
											<motion.div
												initial={{ scale: 0.7 }}
												animate={{ scale: showContactForm ? 1 : 0.7 }}
												transition={{ type: "spring", damping: 14, stiffness: 100 }}
												className="bg-gray-200 min-h-[500px] relative border-4 border-gray-400 shadow-md w-full mx-8"
												style={{ borderStyle: showContactForm ? "outset" : "none" }}
											>
												<div className="flex flex-row"><div className="bg-gray-400 flex items-center justify-center px-1"><PiMinusSquareDuotone /></div><div className="bg-blue-900 text-white text-center flex-1">Program Manager</div><div className="bg-gray-400 flex items-center justify-center px-1 cursor-pointer" onClick={()=>setShowContactForm(false)}><PiXSquareDuotone /></div></div>
									
									<div className="p-2"><h2 className="text-xl font-bold mb-2">Form Container</h2>
									<p>Please fill out the following details.</p>
									<div className="flex justify-end mt-4 absolute bottom-4 left-1/2 -translate-x-1/2">
										<button className="bg-blue-500 text-white px-4 py-2 mr-2 border-4" style={{borderStyle: "outset"}}>Submit</button>
										<button className="bg-gray-500 text-white px-4 py-2 border-4" style={{borderStyle: "outset"}} onClick={()=>setShowContactForm(false)}>Cancel</button>
									</div></div>
											</motion.div>
										</motion.div>
									</motion.div>)}



						{/* <div className="fixed z-[9999] backdrop-blur-sm w-full h-full bg-[rgba(0,0,0,0.5)] left-0 right-0 bottom-0 top-0">
							<div className="flex flex-col items-center justify-center h-full px-8">
								
								
								<div className="bg-gray-200 min-h-[500px] relative   border-4 border-gray-400 shadow-md w-full mx-8" style={{borderStyle: "outset"}}>
									<div className="flex flex-row"><div className="bg-gray-400 flex items-center justify-center px-1"><PiMinusSquareDuotone /></div><div className="bg-blue-900 text-white text-center flex-1">Program Manager</div><div className="bg-gray-400 flex items-center justify-center px-1"><PiXSquareDuotone /></div></div>
									
									<div className="p-2"><h2 className="text-xl font-bold mb-2">Form Container</h2>
									<p>Please fill out the following details.</p>
									<div className="flex justify-end mt-4 absolute bottom-4 left-1/2 -translate-x-1/2">
										<button className="bg-blue-500 text-white px-4 py-2 mr-2 border-4" style={{borderStyle: "outset"}}>Submit</button>
										<button className="bg-gray-500 text-white px-4 py-2 border-4" style={{borderStyle: "outset"}}>Cancel</button>
									</div></div>
								</div>
							</div>
							
						</div> */}

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
