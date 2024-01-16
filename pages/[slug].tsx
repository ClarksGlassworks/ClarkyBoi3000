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
import Link from "next/link";
export default function Post({ product, preview }) {
  const router = useRouter();
  // const morePosts = posts?.edges;

  console.log('------->', product)
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
              <div className="relative">

         
             <div className=" z-10 h-[50vh] bg-green-400 w-full border-b-8 border-white shadow-2xl shadow-black"> 
             <Image src={product.image?.sourceUrl} alt={product.name} width="500" height="300" className="object-cover w-full h-full" />
             </div>
             <div className="absolute z-20 text-[40px] font-semibold text-white p-4  leading-none bottom-[10px]"><h1 className="">{product.name}</h1></div>
             {product.price && (<div className="absolute z-20 text-[20px] font-semibold text-white bg-black rounded-full p-2 right-[20px] top-[20px]">{product.price}</div>)}

             <Link href="../"><div className="absolute z-20 text-[30px] font-semibold text-black  rounded-full p-2 left-[10px] top-[10px]">&larr;</div></Link>

  

             </div>        
             
             <div>
              {product.galleryImages?.nodes?.map((image, index) => { return (
                <Image src={image?.sourceUrl} alt={product.name} width="500" height="300" className="object-cover w-full h-full min-h-screen" key={index} />
              )})}
             </div>
             <div className="w-full px-4 fixed bottom-[20px]"><div  className="bg-black p-4 text-[20px] text-white text-center rounded-full ">Add to Cart</div></div>
            </article>

          </>
        )}
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
