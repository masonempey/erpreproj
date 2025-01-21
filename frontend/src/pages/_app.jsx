import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/navBar";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QjouOGELRRPocWM4KhjA6LdjU98BVpTMcCkU5bTCR7L5mZtrGKZ1j09K9PKOmZHz9e1tnazI4KxIZarGPD2ibZx00EkHBFctr"
);

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Elements stripe={stripePromise}>
        <NavBar />
        <Component {...pageProps} />
      </Elements>
    </UserProvider>
  );
}
