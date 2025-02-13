import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../pages/firebase/config";
import { useUser } from "../context/UserContext";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { user, loading } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAdmin = true;

  return (
    <nav className={`${styles.navbar} ${isAdmin ? styles.admin : ""}`} aria-label="Main Navigation">
      <div className={styles.navbarLeft}>
        { !isAdmin ? (
        <a href="/" className={styles.logo}>
          erpre
        </a> ) : (
          <a href="/admin" className={styles.logo}>
          erpre
        </a>
        )}
      </div>
      <div className={styles.navbarCenter}>
        {!isAdmin ? (
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
        ) : ( <ul className={styles.navLinks}>
          <li>
            <a href="#profile">Profile</a>
          </li>
          <li>
            <a href="#appointments">Appointments</a>
          </li>
          <li>
            <a href="#reports">Reports</a>
          </li>
        </ul> )}
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
