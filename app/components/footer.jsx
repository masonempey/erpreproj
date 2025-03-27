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
  Skeleton
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShopInfo = async () => {
    try {
      setLoading(true);
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
      setError(null);
    } catch (err) {
      console.error("Failed to fetch shop info:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  if (error) {
    return (
      <Box sx={{ 
        background: "#462A19", 
        color: "white", 
        p: 2, 
        textAlign: "center",
        borderTop: '2px solid red'
      }}>
        <Typography>Footer information currently unavailable</Typography>
        <button 
          onClick={fetchShopInfo}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            background: '#D6BEA9',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </Box>
    );
  }

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
          {/* Brand Section */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
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

          {/* Contact Information Section */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
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

            <Stack spacing={2} sx={{ alignItems: { xs: "center", md: "flex-start" }, width: "100%" }}>
              <ContactItem 
                icon={<PhoneIcon sx={{ color: "#D6BEA9" }} />}
                text={loading ? <Skeleton width={120} /> : (shopInfo?.phone || "Not available")}
              />
              
              <ContactItem 
                icon={<EmailIcon sx={{ color: "#D6BEA9" }} />}
                text={loading ? <Skeleton width={180} /> : (shopInfo?.email || "Not available")}
              />
              
              <ContactItem 
                icon={<LocationOnIcon sx={{ color: "#D6BEA9" }} />}
                text={loading ? (
                  <>
                    <Skeleton width={100} />
                    <Skeleton width={80} />
                    <Skeleton width={60} />
                  </>
                ) : (
                  `${shopInfo?.address || ""}, ${shopInfo?.city || ""}, ${shopInfo?.province || ""} ${shopInfo?.postal_code || ""}`
                )}
              />
              
              <ContactItem 
                icon={<AccessTimeIcon sx={{ color: "#D6BEA9" }} />}
                text="Mon-Sat: 9AM-9PM | Sun: 10:30AM-7PM"
              />
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

            <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, mb: 3, width: "100%" }}>
              <SocialIcon icon={<InstagramIcon />} href="https://instagram.com" />
              <SocialIcon icon={<FacebookIcon />} href="https://facebook.com" />
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
              <FooterLink href="/" text="Home" />
              <FooterLink href="/about" text="About" />
              <FooterLink href="#" text="Book Appointment" onClick={() => window.scrollTo(0, 0)} />
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

// Helper components
const ContactItem = ({ icon, text }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {icon}
    <Typography variant="body2">
      {text}
    </Typography>
  </Box>
);

const SocialIcon = ({ icon, href }) => (
  <IconButton
    aria-label="Social link"
    component="a"
    href={href}
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
    {icon}
  </IconButton>
);

const FooterLink = ({ href, text, onClick }) => (
  <Link
    href={href}
    color="inherit"
    underline="hover"
    sx={{ textAlign: { xs: "center", md: "left" } }}
    onClick={onClick}
  >
    {text}
  </Link>
);

export default Footer;