import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPostsForHome, getWooCommerceProducts } from "../lib/api";
import { CMS_NAME } from "../lib/constants";
import Top8Friends from "../components/top8friends";
import Casette from "../components/casette";
import Corner from "../components/corner";
import Gamebody from "../components/gameboy";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import useWindowSize from "../hooks/useWindowSize";

export default function Index({ allPosts: { edges }, preview }) {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  const products = edges.map(({node}) => node).reverse()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll();

  const { isMobile } = useWindowSize();


  const gameboyContainerScale = useTransform(scrollYProgress, [0,1], [0.6, 0.4]);
  const gameboyContainerRotate = useTransform(scrollYProgress, [0, 1], [20, 10]);
  const gameboyContainerY = useTransform(scrollYProgress, [0, 1], ['24%', '50%']);
  const gameboyContainerX = useTransform(scrollYProgress, [0, 1], ['5%', '-40%']);
  const casetteScale = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const casetteRotate = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const casetteY = useTransform(scrollYProgress, [0, 1], [isMobile ? '50px':'0px', isMobile ? '-85px':'0px']);
  const casetteX = useTransform(scrollYProgress, [0, 1], ['0px', '-100px']);

  const gameboyRef=useRef(null)
  const casetteRef=useRef(null)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // console.log({products})
  return (
    <Layout preview={preview}>
      <Head>
        <title>{`Clark's Glassworks | Canadian Made Bongs, Rigs, Dab Rigs & More`}</title>
      </Head>
      <Corner />
      <Top8Friends products={products} />
      {/* @ts-ignore */}
      <Casette isScrolled={isScrolled} scrollYProgress={scrollYProgress} casetteScale={casetteScale} casetteRotate={casetteRotate} casetteX={casetteX} casetteY={casetteY} ref={casetteRef} isMobile={isMobile} />
        {/* @ts-ignore */}
      <Gamebody isScrolled={isScrolled} scrollYProgress={scrollYProgress} gameboyContainerScale={gameboyContainerScale} gameboyContainerRotate={gameboyContainerRotate} gameboyContainerX={gameboyContainerX} gameboyContainerY={gameboyContainerY} ref={gameboyRef} isMobile={isMobile}/>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getWooCommerceProducts({featured: true});

  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
