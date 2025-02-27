import React from "react";
import { useRouter } from "next/router";
import Navbar from "./navBar";
import AdminNavbar from "./AdminBar";
import Footer from "./footer";
import styles from "../styles/Layout.module.css";

const Layout = ({ children }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const isAdmin = router.pathname === "/admin";

  return (
    <div className={styles.layout}>
      {!isLoginPage && !isAdmin && <Navbar />}
      {isAdmin && <AdminNavbar />}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
