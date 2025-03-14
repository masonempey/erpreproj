"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles/globals.css";
import { UserProvider } from "../context/UserContext";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import styles from "./styles/Layout.module.css";

const stripePromise = loadStripe(
  "pk_test_51QjouOGELRRPocWM4KhjA6LdjU98BVpTMcCkU5bTCR7L5mZtrGKZ1j09K9PKOmZHz9e1tnazI4KxIZarGPD2ibZx00EkHBFctr"
);

const theme = createTheme();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Elements stripe={stripePromise}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
              <div className={styles.layout}>
                <Navbar />
                <main className={styles.main}>{children}</main>
                <Footer />
              </div>
            </UserProvider>
          </ThemeProvider>
        </Elements>
      </body>
    </html>
  );
}
