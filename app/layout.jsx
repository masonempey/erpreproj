"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../lib/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles/globals.css";
import { BookingProvider } from "../context/BookingContext";
import { ShopProvider } from "../context/ShopContext";
import { UserProvider } from "../context/UserContext";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import styles from "./styles/Layout.module.css";
import { usePathname } from "next/navigation";

const stripePromise = loadStripe(
  "pk_test_51QjouOGELRRPocWM4KhjA6LdjU98BVpTMcCkU5bTCR7L5mZtrGKZ1j09K9PKOmZHz9e1tnazI4KxIZarGPD2ibZx00EkHBFctr"
);

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isLoginRoute = pathname?.startsWith("/login");

  return (
    <html lang="en">
      <body>
        <Elements stripe={stripePromise}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
              <ShopProvider>
                <BookingProvider>
                  <div className={styles.layout}>
                    {!isAdminRoute && !isLoginRoute && <Navbar />}
                    <main
                      className={isAdminRoute ? styles.adminMain : styles.main}
                    >
                      {children}
                    </main>
                    {!isAdminRoute && !isLoginRoute && <Footer />}
                  </div>
                </BookingProvider>
              </ShopProvider>
            </UserProvider>
          </ThemeProvider>
        </Elements>
      </body>
    </html>
  );
}
