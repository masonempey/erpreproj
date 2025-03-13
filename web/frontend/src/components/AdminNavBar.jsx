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

  const dashBoardMessage = "This is the Dashboard page!. Here you can view your upcoming appointments, review appointment details and or cancel them!";
  const timeSlotsMessage = "This is the Set Time Slot's page! Here you can conveniently modify time slots for future appointments at your leisure!";
  const servicesMessage = "This is the Change Available Services page! Here you can modify the services you offer to your clients!";
  const analyticsMessage = "This is the View Personal Analytics page! Here you can view your financial analytics and track your earnings!";
  const editProfileMessage = "This is the Edit Profile page! Here you can modify your personal information and update your profile picture!";
  const tutorialMessage = "This is the button you just clicked! You can use this button to view the tutorial at any time!";
  const notificationsMessage = "This is the Notifications button! Check here to view your notifications at any time!";

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.header}>
        <h1>Erpre B&S</h1>
        {!isTutorial ? (<h1>Welcome George!</h1> ) : (<button className={styles.exitTutorial} onClick={(e) => handleChangeView("dashboard", handleTutorialDisplay(e, null, false))}>Exit Tutorial!</button>)}
        {isTutorial ? ( 
          <ul className={styles.profile}>
            <li> 
            <IconButton onClick={(e) => handleTutorialDisplay(e, tutorialMessage)}>
              <HelpOutlineIcon sx={{ fontSize: "2.5rem"}}/>
            </IconButton>
            </li>
          <li> 
            <IconButton onClick={(e) => handleTutorialDisplay(e, notificationsMessage)}>
              <NotificationsIcon sx={{ fontSize: "2.5rem"}}/>
            </IconButton>
          </li> 
          <li>
            <ProfilePopup user={user} onClose={toggleProfilePopup} sx={{ fontSize: "2.5rem" }}/>
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
                <IconButton onClick={(e) => handleTutorialDisplay(e, dashBoardMessage)}>
                  <HomeIcon sx={{ fontSize: "4.5rem", color: isDashboard ? "#e6853b" : ""}}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Set Time Available Slots">
                <IconButton onClick={(e) => handleTutorialDisplay(e, timeSlotsMessage)}>
                  <MoreTimeIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Change Available Services">
                <IconButton onClick={(e) => handleTutorialDisplay(e, servicesMessage)}>
                  <ContentCutIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="View Personal Analytics">
                <IconButton onClick={(e) => handleTutorialDisplay(e, analyticsMessage)}>
                  <AssessmentIcon sx={{ fontSize: "4.5rem" }}/>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Edit Profile">
                <IconButton onClick={(e) => handleTutorialDisplay(e, editProfileMessage)}>
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