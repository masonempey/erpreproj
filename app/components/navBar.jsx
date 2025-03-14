"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "../../context/UserContext";
import Stack from "@mui/material/Stack";
import ProfilePopup from "./ProfilePopup";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <nav className={styles.navbar}>
        <div>Loading...</div>
      </nav>
    );
  }

  console.log("user: ", user);

  return (
    <nav className={styles.navbar} aria-label="Main Navigation">
      <div className={styles.navbarLeft}>
        <Link href="/" className={styles.logo}>
          erpre
        </Link>
      </div>
      <div className={styles.navbarCenter}>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/admin">Admin</Link>
          </li>
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
              <Stack direction="row" spacing={2}>
                <ProfilePopup user={user} />
              </Stack>
            </li>
          ) : (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
