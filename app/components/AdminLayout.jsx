"use client";

import React from "react";
import {
  Box,
  Paper,
  Container,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import { useUser } from "@/context/UserContext";

export default function AdminLayout({ children, title = "Admin Dashboard" }) {
  const { user } = useUser();

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
        elevation={3}
        sx={{
          bgcolor: "#35281f",
          color: "white",
          p: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          mb: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Oleo Script", cursive',
                fontWeight: "bold",
              }}
            >
              erpre admin
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">
                Welcome, {user?.name || "Admin"}
              </Typography>
              <Avatar sx={{ bgcolor: "#e6853b" }}>
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </Avatar>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#35281f" }}>
            {title}
          </Typography>
          <Divider sx={{ mt: 1, mb: 3 }} />
        </Box>
        {children}
      </Container>

      {/* Footer */}
      <Paper
        elevation={3}
        sx={{
          mt: "auto",
          p: 2,
          borderRadius: 0,
          bgcolor: "#35281f",
          color: "#fafafa",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} | Erpre Barber and Shop | Admin Panel
        </Typography>
      </Paper>
    </Box>
  );
}
