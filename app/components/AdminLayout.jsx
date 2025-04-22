"use client";

import React from "react";
import {
  Box,
  Paper,
  Container,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useUser } from "@/context/UserContext";

export default function AdminLayout({ children, title = "Admin Dashboard" }) {
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        width: "100%",
      }}
    >
      {/* Header */}
      <Paper
        elevation={4}
        sx={{
          background: "linear-gradient(90deg, #35281f 0%, #4a392e 100%)",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          mb: 2,
          borderBottom: "3px solid #e6853b",
        }}
      >
        <Container maxWidth="xl" disableGutters={isMobile}>
          {/* Top header section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: { xs: 1.5, sm: 2 },
              px: { xs: 2, sm: 3 },
            }}
          >
            {/* Logo Section */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Oleo Script", cursive',
                  fontWeight: "bold",
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.125rem" },
                  color: "#e6853b",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                erpre
              </Typography>
              <Box
                sx={{
                  ml: 1,
                  px: 1,
                  py: 0.5,
                  bgcolor: "rgba(230, 133, 59, 0.2)",
                  borderRadius: "4px",
                  border: "1px solid rgba(230, 133, 59, 0.3)",
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { sm: "0.7rem", md: "0.8rem" },
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                    color: "#e6853b",
                  }}
                >
                  ADMIN PANEL
                </Typography>
              </Box>
            </Box>

            {/* Admin Tools */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5, md: 2 },
              }}
            >
              {/* Only keeping notifications - removed dashboard and settings */}
              {!isMobile && (
                <>
                  <Tooltip title="Notifications">
                    <IconButton
                      size={isTablet ? "small" : "medium"}
                      onClick={handleNotificationOpen}
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.1)",
                          color: "#fff",
                        },
                      }}
                    >
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon
                          fontSize={isTablet ? "small" : "medium"}
                        />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      mx: 0.5,
                    }}
                  />
                </>
              )}

              {/* User section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  pl: isMobile ? 0 : 1,
                }}
              >
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {user?.name || "Admin User"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.8,
                      fontSize: "0.7rem",
                      display: "block",
                    }}
                  >
                    Administrator
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor: "#e6853b",
                    width: { xs: 36, sm: 40, md: 40 },
                    height: { xs: 36, sm: 40, md: 40 },
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                    },
                  }}
                  onClick={handleMenuOpen}
                >
                  {user?.name ? user.name[0].toUpperCase() : "A"}
                </Avatar>
              </Box>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Admin dropdown menu - unchanged */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            "& .MuiMenuItem-root": {
              fontSize: "0.9rem",
              py: 1.2,
              "&:hover": {
                bgcolor: "rgba(230, 133, 59, 0.08)",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            backgroundColor: "rgba(230, 133, 59, 0.03)",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.name || "Admin"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            {user?.email || "admin@erpre.com"}
          </Typography>
        </Box>

        <MenuItem onClick={handleMenuClose}>
          <AccountCircleIcon
            fontSize="small"
            sx={{ mr: 1.5, color: "#35281f" }}
          />
          My Profile
        </MenuItem>

        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: "#35281f" }} />
          Account Settings
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: "error.main",
            "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu - unchanged */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            width: 320,
            maxWidth: "calc(100vw - 32px)",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Menu content unchanged */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            backgroundColor: "#35281f",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Notifications
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "inline-block",
              bgcolor: "#e6853b",
              color: "white",
              px: 0.8,
              py: 0.2,
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            3 New
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
          <MenuItem
            onClick={handleNotificationClose}
            sx={{
              py: 1.5,
              borderLeft: "3px solid #e6853b",
              bgcolor: "rgba(230, 133, 59, 0.05)",
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={500}>
                New appointment request
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                John Doe booked for a haircut at 3:00 PM
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                5 minutes ago
              </Typography>
            </Box>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Inventory update needed
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Hair styling gel is running low
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                2 hours ago
              </Typography>
            </Box>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Staff schedule updated
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Carl will be on vacation next week
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                1 day ago
              </Typography>
            </Box>
          </MenuItem>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            py: 1.5,
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="body2"
            color="primary"
            sx={{
              fontWeight: 500,
              fontSize: "0.8rem",
              cursor: "pointer",
              color: "#e6853b",
            }}
            onClick={handleNotificationClose}
          >
            View All Notifications
          </Typography>
        </Box>
      </Menu>

      {/* Main content and footer - unchanged */}
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          mb: 4,
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#35281f",
              fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" },
            }}
          >
            {title}
          </Typography>
          <Divider sx={{ mt: 1, mb: 3 }} />
        </Box>
        {children}
      </Container>

      <Paper
        elevation={3}
        sx={{
          mt: "auto",
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1, sm: 2 },
          borderRadius: 0,
          bgcolor: "#35281f",
          color: "#fafafa",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" } }}
        >
          © {new Date().getFullYear()} | Erpre Barber and Shop | Admin Panel
        </Typography>
      </Paper>
    </Box>
  );
}
