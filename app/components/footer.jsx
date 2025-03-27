"use client";
import React, { useEffect, useState } from "react";
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
  const [shopInfo, setShopInfo] = useState(null);

  const fetchShopInfo = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/shop");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setShopInfo({
        shop_name: data.shop_name || '',
        address: data.address || '',
        city: data.city || '',
        province: data.province || '',
        postal_code: data.postal_code || '',
        phone: data.phone || '',
        email: data.email || ''
      });
    } catch (err) {
      console.error("Failed to fetch shop info:", err);
    }
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  return (
    <Box
      sx={{
        background: "#462A19", // Simpler background, less styled than yours
        color: "#fafafa",
        pt: 4,
        pb: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h5" sx={{ color: "#fafafa", mb: 2 }}>
              Erpre Barber & Shop
            </Typography>
            <Typography variant="body2">
              Quality grooming services since 2023.
            </Typography>
          </Box>

          {/* Contact Information Section */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Information
            </Typography>
            <Stack spacing={1}>
              <ContactItem 
                icon={<PhoneIcon />}
                text={shopInfo?.phone || "Not available"}
              />
              <ContactItem 
                icon={<EmailIcon />}
                text={shopInfo?.email || "Not available"}
              />
              <ContactItem 
                icon={<LocationOnIcon />}
                text={`${shopInfo?.address || ""}, ${shopInfo?.city || ""}, ${shopInfo?.province || ""} ${shopInfo?.postal_code || ""}`}
              />
              <ContactItem 
                icon={<AccessTimeIcon />}
                text="Mon-Sat: 9AM-9PM"
              />
            </Stack>
          </Box>

          {/* Social Links Section - From Main */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, mb: 2 }}>
              <SocialIcon icon={<InstagramIcon />} href="https://instagram.com" />
              <SocialIcon icon={<FacebookIcon />} href="https://facebook.com" />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Stack direction={{ xs: "row", md: "column" }} spacing={1}>
              <FooterLink href="/" text="Home" />
              <FooterLink href="/about" text="About" />
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.2)" }} />

        <Typography variant="body2" align="center" sx={{ color: "#fafafa" }}>
          © {new Date().getFullYear()} Erpre Barber and Shop
        </Typography>
      </Container>
    </Box>
  );
};

// Helper components
const ContactItem = ({ icon, text }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Typography variant="body2">{text}</Typography>
  </Box>
);

const SocialIcon = ({ icon, href }) => (
  <IconButton
    aria-label="Social link"
    component="a"
    href={href}
    target="_blank"
    sx={{ mr: 1, color: "#fafafa" }}
  >
    {icon}
  </IconButton>
);

const FooterLink = ({ href, text }) => (
  <Link href={href} color="inherit" underline="hover">
    {text}
  </Link>
);

export default Footer;