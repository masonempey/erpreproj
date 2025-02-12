import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../styles/globals.css";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Layout from "../components/layout";

const stripePromise = loadStripe(
  "pk_test_51QjouOGELRRPocWM4KhjA6LdjU98BVpTMcCkU5bTCR7L5mZtrGKZ1j09K9PKOmZHz9e1tnazI4KxIZarGPD2ibZx00EkHBFctr"
);

const theme = createTheme();
const auth = getAuth();
function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} user={user} />
        </Layout>
      </ThemeProvider>
    </Elements>
  );
}

export default MyApp;
