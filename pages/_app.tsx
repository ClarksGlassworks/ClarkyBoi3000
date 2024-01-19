import { AppProps } from "next/app";
import "../styles/index.css";
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <PayPalScriptProvider options={{ 'clientId': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency:'CAD', intent: 'capture' }}><Component {...pageProps} /></PayPalScriptProvider>)
}

export default MyApp;
