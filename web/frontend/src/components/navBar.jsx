import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../pages/firebase/config";
import { useUser } from "../context/UserContext";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange } from "@mui/material/colors";
import ProfilePopup from "./ProfilePopup"; // Import the ProfilePopup component
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { user, loading } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfilePopup = () => {
    setIsProfileOpen(!isProfileOpen);
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
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{ bgcolor: deepOrange[500], visibility: isProfileOpen ? 'hidden' : 'visible' }}
                  onClick={toggleProfilePopup}
                >
                  {user.displayName ? user.displayName.charAt(0) : "U"}
                </Avatar>
              </Stack>
            </li>
          ) : (
            <li>
              <a href="/login">Login</a>
            </li>
          )}
        </ul>
      </div>
      {isProfileOpen && <ProfilePopup user={user} onClose={toggleProfilePopup} />}
    </nav>
  );
};

export default Navbar;