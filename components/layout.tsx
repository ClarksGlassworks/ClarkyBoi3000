import Alert from "./alert";
import Footer from "./footer";
import Meta from "./meta";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen w-full">

        <div className="hash-lines w-full min-h-screen fixed -z-10 bottom-0 top-0"></div>
        <div className="layer1 w-full min-h-screen fixed z-10 bottom-0 top-0"></div>

        <main className="z-20 relative w-full">{children}</main>
      </div>
    </>
  );
}
