import { UserProvider } from "@auth0/nextjs-auth0/client";
import Layout from "../components/layout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../styles/globals.css";

const stripePromise = loadStripe(
  "pk_test_51QjouOGELRRPocWM4KhjA6LdjU98BVpTMcCkU5bTCR7L5mZtrGKZ1j09K9PKOmZHz9e1tnazI4KxIZarGPD2ibZx00EkHBFctr"
);

const theme = createTheme();

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Elements stripe={stripePromise}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </Elements>
    </UserProvider>
  );
}
