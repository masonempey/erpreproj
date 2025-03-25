"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  Link,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #5F402C 0%, #462A19 100%)",
        color: "#fafafa",
        pt: 6,
        pb: 3,
        boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mb: 5,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Oleo Script", cursive',
                color: "#fafafa",
                mb: 1,
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              erpre
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Oleo Script", cursive',
                color: "#D6BEA9",
                mb: 3,
              }}
            >
              Barber & Shop
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 2,
                maxWidth: 300,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Discover the art of grooming at erpre Barber & Shop, where
              tradition meets modern style. Our skilled barbers deliver
              precision cuts and exceptional service.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                textAlign: { xs: "center", md: "left" },
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: isMobile ? "50%" : 0,
                  transform: isMobile ? "translateX(-50%)" : "none",
                  width: 50,
                  height: 2,
                  bgcolor: "#D6BEA9",
                },
              }}
            >
              Contact Information
            </Typography>

            <Stack
              spacing={2}
              sx={{
                alignItems: { xs: "center", md: "flex-start" },
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ mr: 1, color: "#D6BEA9" }} />
                <Typography variant="body2">403-452-0154</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon sx={{ mr: 1, color: "#D6BEA9" }} />
                <Typography variant="body2">
                  erprebarberandshop@gmail.com
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon sx={{ mr: 1, color: "#D6BEA9" }} />
                <Typography variant="body2">
                  1012 16 Ave NW 2nd floor, Calgary, AB T2M 0K5
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ mr: 1, color: "#D6BEA9" }} />
                <Typography variant="body2">
                  Mon-Sat: 9AM-9PM | Sun: 10:30AM-7PM
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                textAlign: { xs: "center", md: "left" },
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: isMobile ? "50%" : 0,
                  transform: isMobile ? "translateX(-50%)" : "none",
                  width: 50,
                  height: 2,
                  bgcolor: "#D6BEA9",
                },
              }}
            >
              Follow Us
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: 3,
                width: "100%",
              }}
            >
              <IconButton
                aria-label="Instagram"
                component="a"
                href="https://instagram.com"
                target="_blank"
                sx={{
                  mr: 2,
                  color: "#fafafa",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "#D6BEA9",
                    color: "#5F402C",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>

              <IconButton
                aria-label="Facebook"
                component="a"
                href="https://facebook.com"
                target="_blank"
                sx={{
                  color: "#fafafa",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "#D6BEA9",
                    color: "#5F402C",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Box>

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                textAlign: { xs: "center", md: "left" },
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: isMobile ? "50%" : 0,
                  transform: isMobile ? "translateX(-50%)" : "none",
                  width: 50,
                  height: 2,
                  bgcolor: "#D6BEA9",
                },
              }}
            >
              Quick Links
            </Typography>

            <Stack
              direction={{ xs: "row", md: "column" }}
              spacing={2}
              sx={{
                flexWrap: { xs: "wrap", md: "nowrap" },
                justifyContent: { xs: "center", md: "flex-start" },
                width: "100%",
              }}
            >
              <Link
                href="/"
                color="inherit"
                underline="hover"
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                Home
              </Link>
              <Link
                href="/about"
                color="inherit"
                underline="hover"
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                About
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo(0, 0);
                }}
                color="inherit"
                underline="hover"
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                Book Appointment
              </Link>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ mt: 5, mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ color: "rgba(255,255,255,0.7)" }}
        >
          © {new Date().getFullYear()} | Erpre Barber and Shop | All Rights
          Reserved | Website created by The Copilots
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
