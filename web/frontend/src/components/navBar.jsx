import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { user, error, isLoading } = useUser();

  return (
    <nav className={styles.navbar} aria-label="Main Navigation">
      <div className={styles.navbarLeft}>
        <a href="/" className={styles.logo}>
          erpre
        </a>
      </div>
      <div className={styles.navbarCenter}>
        <ul className={styles.navLinks}>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#book">Book Now</a>
          </li>
        </ul>
      </div>
      <div className={styles.navbarRight}>
        <ul className={styles.navLinks}>
          {user ? (
            <li>
              <a href="/api/auth/logout">Logout</a>
            </li>
          ) : (
            <li>
              <a href="/api/auth/login">Login</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
