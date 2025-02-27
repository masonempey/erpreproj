import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../pages/firebase/config";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { deepOrange } from "@mui/material/colors";

// Generated using Github Copilot (GPT 4o)
const ProfilePopup = ({ user, onClose }) => {
  // handleLogout uses async to handle promises returned by signOut using await. Async keyword makes it an asynchronous function.
  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "5%",
        right: "2%",
        width: 300,
        height: "auto",
        bgcolor: "background.paper",
        boxShadow: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 2,
        zIndex: 1000,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, left: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Avatar
        sx={{ bgcolor: deepOrange[500], width: 80, height: 80, mb: 2 }}
      >
        {user.displayName ? user.displayName.charAt(0) : "U"}
      </Avatar>
      <Typography variant="h6">{user.displayName || "User"}</Typography>
      <Typography variant="body2" color="textSecondary">
        {user.email}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ProfilePopup;