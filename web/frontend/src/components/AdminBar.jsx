import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../pages/firebase/config";
import { useUser } from "../context/UserContext";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange } from "@mui/material/colors";
import ProfilePopup from "./ProfilePopup"; // Import the ProfilePopup component
import styles from "../styles/Navbar.module.css";
import HomeIcon from "@mui/icons-material/Home";
import ReportIcon from "@mui/icons-material/Report";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const AdminNavbar = () => {
  const { user, loading } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfilePopup = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className={styles.navbar} aria-label="Admin Navigation">
      <div className={styles.navbarLeft}>
        <a href="/admin/dashboard" className={styles.logo}>
          Admin Dashboard
        </a>
      </div>
      <div className={styles.navbarCenter}>
        <ul className={styles.navLinks}>
          <li>
            <Tooltip title="View Profile" sx={{ color: "white" }}>
              <IconButton>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip title="Home">
              <IconButton href="/admin/dashboard">
                <HomeIcon />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip title="View Reports">
              <IconButton href="/admin/reports">
                <ReportIcon />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip title="Set Notifications" sx={{ color: "white" }}>
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          </li>
        </ul>
      </div>
      <div className={styles.navbarRight}>
        <ul className={styles.navLinks}>
          {user ? (
            <>
              <li>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Profile">
                    <Avatar
                      sx={{ bgcolor: deepOrange[500], visibility: isProfileOpen ? 'hidden' : 'visible' }}
                      onClick={toggleProfilePopup}
                    >
                      {user.displayName ? user.displayName.charAt(0) : "U"}
                    </Avatar>
                  </Tooltip>
                </Stack>
              </li>
            </>
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

export default AdminNavbar;