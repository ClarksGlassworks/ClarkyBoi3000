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
import { getAllPostsWithSlug, getPostAndMorePosts, getWooCommerceProduct,  getWooCommerceProducts } from "../lib/api";
// import { CMS_NAME } from "../../lib/constants";
import Layout from "../components/layout";
import Product from "../components/product";
import Image from "next/image";
export default function Post({ product, preview }) {
  const router = useRouter();
  // const morePosts = posts?.edges;

  console.log('------->', product)
  if (!router.isFallback && !product?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Product preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {`${product.name} | Clark's Glassworks`}
                </title>
                <meta
                  property="og:image"
                  content={product.image?.node?.sourceUrl}
                />
              </Head>

             <h1>{product.name}</h1>
             <Image src={product.image?.sourceUrl} alt={product.name} width="500" height="300" />
            </article>

          </>
        )}
      </Container>
    </Product>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  const data = await getWooCommerceProduct(params?.slug);
  return {
    props: {
      product: data,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getWooCommerceProducts({featured: null});

  return {
    paths: allPosts.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: true,
  };
};
