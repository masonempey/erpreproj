import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../pages/firebase/config";
import styles from "../styles/Navbar.module.css";

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

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
              <button onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <li>
              <a href="/login">Login</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
