import { Html, Head, Main, NextScript } from "next/document";
import { ToastContainer } from "react-toastify";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Honk&display=swap" rel="stylesheet" />
     
      </Head>
      <body>
        {/* <div className="z-[98] w-full h-screen fixed"><ToastContainer /></div> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
