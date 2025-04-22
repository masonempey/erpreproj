"use client";

import React, { useState, useEffect } from "react";
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

const Navbar = () => {
  const { user, loading } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navLinks = [
    { name: "Book Now", href: "/", icon: <BookOnlineIcon /> },
    { name: "Home", href: "/", icon: <HomeIcon /> },
    { name: "About", href: "/about", icon: <InfoIcon /> },
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
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled ? "#35281f" : "rgba(53, 40, 31, 0.95)",
          transition: "all 0.3s ease",
          boxShadow: scrolled
            ? "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
            : "none",
          height: { xs: 56, sm: 64, md: 64 },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              py: { xs: 0.75, sm: 1 },
              height: "100%",
            }}
          >
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
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.5rem",
                },
                transition: "all 0.3s ease",
              }}
            >
              erpre
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    component={Link}
                    href={link.href}
                    sx={{
                      mx: { sm: 2, md: 3, lg: 5 },
                      color: "#fafafa",
                      fontSize: { sm: "0.9rem", md: "1rem" },
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "0",
                        height: "2px",
                        bottom: "0",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#e6853b",
                        transition: "width 0.3s ease",
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                        "&::after": {
                          width: "80%",
                        },
                      },
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Section - Profile/Login */}
            <Box>
              {isMobile ? (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer}
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    p: { xs: 1, sm: 1.5 },
                    color: "#fafafa",
                  }}
                >
                  <MenuIcon sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} />
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
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    px: { sm: 2, md: 3 },
                    py: { sm: 0.8, md: 1 },
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
            width: isSmallScreen ? "85%" : "70%",
            maxWidth: "300px",
            bgcolor: "#35281f",
            color: "#fafafa",
            pt: isSmallScreen ? 1 : 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: isSmallScreen ? 1 : 2,
          }}
        >
          <IconButton
            color="inherit"
            onClick={toggleDrawer}
            edge="end"
            aria-label="close drawer"
            sx={{
              p: isSmallScreen ? 0.75 : 1.25,
              color: "#e6853b",
            }}
          >
            <CloseIcon
              sx={{ fontSize: isSmallScreen ? "1.5rem" : "1.75rem" }}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            mt: isSmallScreen ? 0 : 1,
            mb: isSmallScreen ? 2 : 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Oleo Script", cursive',
              fontWeight: "bold",
              color: "#e6853b",
              fontSize: isSmallScreen ? "1.8rem" : "2.2rem",
            }}
          >
            erpre
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: isSmallScreen ? "0.85rem" : "1rem",
              color: "#fafafa",
              opacity: 0.9,
            }}
          >
            Barber & Shop
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: "rgba(250,250,250,0.1)" }} />

        <List sx={{ pt: isSmallScreen ? 1 : 2 }}>
          {navLinks.map((link) => (
            <ListItem
              key={link.name}
              button
              component={Link}
              href={link.href}
              onClick={toggleDrawer}
              sx={{
                py: isSmallScreen ? 1.25 : 1.75,
                "&:hover": {
                  backgroundColor: "rgba(230, 133, 59, 0.15)",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <Box
                sx={{
                  mr: 2,
                  color: "#e6853b",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {React.cloneElement(link.icon, {
                  fontSize: isSmallScreen ? "small" : "medium",
                })}
              </Box>
              <ListItemText
                primary={link.name}
                primaryTypographyProps={{
                  fontSize: isSmallScreen ? "0.95rem" : "1rem",
                  color: "#fafafa",
                  fontWeight: "500",
                }}
              />
            </ListItem>
          ))}

          <Divider
            sx={{ my: isSmallScreen ? 1 : 2, bgcolor: "rgba(250,250,250,0.1)" }}
          />

          {user ? (
            <Box
              sx={{
                px: 3,
                py: isSmallScreen ? 1.5 : 2,
                mt: isSmallScreen ? 0 : 1,
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                mx: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                  color: "#fafafa",
                  opacity: 0.7,
                }}
              >
                Logged in as:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: isSmallScreen ? "0.9rem" : "1rem",
                  color: "#e6853b",
                }}
              >
                {user.name || user.email}
              </Typography>
            </Box>
          ) : (
            <ListItem
              button
              component={Link}
              href="/login"
              onClick={toggleDrawer}
              sx={{
                py: isSmallScreen ? 1.5 : 2,
                bgcolor: "rgba(230, 133, 59, 0.2)",
                mt: isSmallScreen ? 0.5 : 1,
                mx: 2,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "rgba(230, 133, 59, 0.3)",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <Box
                sx={{
                  mr: 2,
                  color: "#e6853b",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LoginIcon fontSize={isSmallScreen ? "small" : "medium"} />
              </Box>
              <ListItemText
                primary="Login"
                primaryTypographyProps={{
                  fontSize: isSmallScreen ? "0.95rem" : "1rem",
                  fontWeight: "medium",
                  color: "#fafafa",
                }}
              />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* Fixed height spacer to match exact AppBar height */}
      <Box
        sx={{
          height: { xs: 56, sm: 64, md: 64 },
          width: "100%",
        }}
      />
    </>
  );
};

export default Navbar;
