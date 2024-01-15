import Alert from "./alert";
import Footer from "./footer";
import Meta from "./meta";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">

        <div className="hash-lines w-full h-screen fixed -z-10"></div>
        <div className="layer1 w-full h-screen fixed z-10"></div>

        <main className="z-20 relative">{children}</main>
      </div>
    </>
  );
}
