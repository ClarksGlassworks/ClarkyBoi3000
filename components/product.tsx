
import Layout from "./layout";
import Meta from "./meta";

export default function Product({ preview, children }) {
  return (
    <>
    <Layout preview={preview}>
      <Meta />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      </Layout>
    </>
  );
}
