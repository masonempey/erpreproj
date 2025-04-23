// components/Navbar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "../../context/UserContext";
import ProfilePopup from "./ProfilePopup";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";

const Navbar = ({ onBookNow }) => {
  const { user, loading } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((p) => !p);

  // Always scroll the window to the very top
  const scrollToTop = () =>
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  const navLinks = [
    { name: "Book Now", action: onBookNow, icon: <BookOnlineIcon /> },
    { name: "Home",     action: scrollToTop, icon: <HomeIcon /> },
    {
      name: "About",
      action: () => {
        const el = document.getElementById("about");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      icon: <InfoIcon />,
    },
  ];

  if (loading) {
    return (
      <AppBar position="fixed" sx={{ bgcolor: "#35281f" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: "#fafafa" }}>
            Loading...
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="fixed" elevation={4} sx={{ bgcolor: "#35281f" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Typography
              variant="h4"
              component={Link}
              href="/"
              sx={{
                fontFamily: '"Oleo Script", cursive',
                fontWeight: "bold",
                color: "#fafafa",
                textDecoration: "none",
                mr: 2,
              }}
            >
              erpre
            </Typography>

            {/* Desktop nav */}
            {!isMobile && (
              <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    onClick={link.action}
                    sx={{
                      mx: 5,
                      color: "#fafafa",
                      fontSize: "1rem",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: 0,
                        height: "2px",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#e6853b",
                        transition: "width 0.3s ease",
                      },
                      "&:hover": {
                        "&::after": { width: "80%" },
                      },
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right section */}
            <Box>
              {isMobile ? (
                <IconButton edge="end" color="inherit" onClick={toggleDrawer}>
                  <MenuIcon sx={{ fontSize: "2rem" }} />
                </IconButton>
              ) : user ? (
                <ProfilePopup user={user} />
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: "#fafafa",
                    borderColor: "#e6853b",
                    "&:hover": {
                      borderColor: "#fafafa",
                      backgroundColor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: "70%",
            maxWidth: "300px",
            bgcolor: "#35281f",
            color: "#fafafa",
            pt: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ textAlign: "center", mt: 2, mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Oleo Script", cursive',
              fontWeight: "bold",
              color: "#e6853b",
            }}
          >
            erpre
          </Typography>
          <Typography variant="subtitle1">Barber & Shop</Typography>
        </Box>
        <Divider sx={{ bgcolor: "rgba(250,250,250,0.1)" }} />
        <List>
          {navLinks.map((link) => (
            <ListItem
              key={link.name}
              button
              onClick={() => {
                link.action();
                toggleDrawer();
              }}
              sx={{ py: 2 }}
            >
              <Box sx={{ mr: 2, color: "#e6853b" }}>{link.icon}</Box>
              <ListItemText primary={link.name} />
            </ListItem>
          ))}
          <Divider sx={{ my: 2, bgcolor: "rgba(250,250,250,0.1)" }} />
          {user ? (
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Logged in as:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {user.name || user.email}
              </Typography>
            </Box>
          ) : (
            <ListItem
              button
              component={Link}
              href="/login"
              onClick={toggleDrawer}
              sx={{ py: 2, bgcolor: "rgba(230, 133, 59, 0.2)" }}
            >
              <Box sx={{ mr: 2, color: "#e6853b" }}>
                <LoginIcon />
              </Box>
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
