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

export default function Index({ allPosts: { edges }, preview }) {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  const products = edges.map(({node}) => node).reverse()


  console.log({products})
  return (
    <Layout preview={preview}>
      <Head>
        <title>{`Clark's Glassworks | Canadian Made Bongs, Rigs, Dab Rigs & More`}</title>
      </Head>
      <Container>
      <>
      <Top8Friends products={products} />
      <Casette />
      <Corner />
      <Gamebody />
      </>
      </Container>
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
