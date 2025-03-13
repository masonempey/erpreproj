import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import ProfilePopup from "./ProfilePopup";
import styles from "../styles/AdminNavBar.module.css";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import IconButton from "@mui/material/IconButton";
import ContentCutIcon from '@mui/icons-material/ContentCut';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from "@mui/material/Tooltip";

const AdminNavBar = ({handleChangeView, selectedView, tutorialDisplay, handleTutorialDisplay}) => {
  const { user, loading } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfilePopup = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const isDashboard = selectedView == "Dashboard";
  const isTutorial = selectedView == "Tutorial";

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.header}>
        <h1>Erpre B&S</h1>
        {!isTutorial ? (<h1>Welcome George!</h1> ) : (<button className={styles.exitTutorial} onClick={() => handleChangeView("dashboard")}>Exit Tutorial!</button>)}
        {isTutorial ? ( 
          <ul className={styles.profile}>
            <li> 
            <IconButton onClick={() => handleTutorialDisplay("Tutorial")}>
              <HelpOutlineIcon sx={{ fontSize: "2.5rem"}}/>
            </IconButton>
            </li>
          <li> 
            <IconButton onClick={() => handleTutorialDisplay("ViewNotifications")}>
              <NotificationsIcon sx={{ fontSize: "2.5rem"}}/>
            </IconButton>
          </li> 
        </ul>
        ) : ( 
        <ul className={styles.profile}>
          <li> 
            <IconButton onClick={() => handleChangeView("Tutorial")}>
              <HelpOutlineIcon sx={{ fontSize: "2.5rem"}}/>
            </IconButton>
          </li>
          <li> 
            <IconButton onClick={() => handleChangeView("ViewNotifications")}>
              <NotificationsIcon sx={{ fontSize: "2.5rem"}}/>
            </IconButton>
          </li>
          <li>
            <ProfilePopup user={user} onClose={toggleProfilePopup} sx={{ fontSize: "2.5rem" }}/>
          </li>
        </ul>
        )}        
      </div>
      <nav className={styles.navbar}>
        <div className={styles.navbarCenter}>
        {isTutorial ? ( 
          <ul className={styles.navLinks}>
            <li>
              <Tooltip title="Dashboard">
                <IconButton onClick={() => handleTutorialDisplay("dashboard")}>
                  <HomeIcon sx={{ fontSize: "4.5rem", color: isDashboard ? "#e6853b" : ""}}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Set Time Available Slots">
                <IconButton onClick={() => handleTutorialDisplay("TimeSlots")}>
                  <MoreTimeIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Change Available Services">
                <IconButton onClick={() => handleTutorialDisplay("notifications")}>
                  <ContentCutIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="View Personal Analytics">
                <IconButton onClick={() => handleTutorialDisplay("reports")}>
                  <AssessmentIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Edit Profile">
                <IconButton onClick={() => handleTutorialDisplay("Edit Profile")}>
                  <ManageAccountsIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
          </ul>
          ) : (
          <ul className={styles.navLinks}>
            <li>
              <Tooltip title="Dashboard">
                <IconButton onClick={() => handleChangeView("Dashboard")}>
                  <HomeIcon sx={{ fontSize: "4.5rem", color: isDashboard ? "#e6853b" : ""}}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Set Time Available Slots">
                <IconButton onClick={() => handleChangeView("TimeSlots")}>
                  <MoreTimeIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Change Available Services">
                <IconButton onClick={() => handleChangeView("Services")}>
                  <ContentCutIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="View Personal Analytics">
                <IconButton onClick={() => handleChangeView("Analytics")}>
                  <AssessmentIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Edit Profile">
                <IconButton onClick={() => handleChangeView("Edit Profile")}>
                  <ManageAccountsIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
          </ul> 
          )}
        </div>
      </nav>
    </div>
  );
};

export default AdminNavBar;