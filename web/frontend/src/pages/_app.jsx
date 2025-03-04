import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../styles/globals.css";
import { UserProvider } from "../context/UserContext";
import Layout from "../components/layout";
import 'bootstrap/dist/css/bootstrap.min.css';

const stripePromise = loadStripe(
  "pk_test_51QjouOGELRRPocWM4KhjA6LdjU98BVpTMcCkU5bTCR7L5mZtrGKZ1j09K9PKOmZHz9e1tnazI4KxIZarGPD2ibZx00EkHBFctr"
);

const theme = createTheme();

function MyApp({ Component, pageProps }) {
  return (
    <Elements stripe={stripePromise}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </ThemeProvider>
    </Elements>
  );
}

export default MyApp;
