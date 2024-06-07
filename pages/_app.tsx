import { AppProps } from "next/app";
import "../styles/index.css";
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <PayPalScriptProvider options={{ 'clientId': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency:'CAD', intent: 'capture' }}><Component {...pageProps} /><TawkMessengerReact propertyId="6663184b9a809f19fb3b1484" widgetId="1hvphdpk0" /></PayPalScriptProvider>)
}

export default MyApp;
