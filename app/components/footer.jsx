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
  Grid,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [shopInfo, setShopInfo] = useState(null);

  const fetchShopInfo = async () => {
    try {
      // Use relative URL so it works in production too
      const response = await fetch("/api/shop");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setShopInfo({
        shop_name: data.shop_name || "",
        address: data.address || "",
        city: data.city || "",
        province: data.province || "",
        postal_code: data.postal_code || "",
        phone: data.phone || "",
        email: data.email || "",
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
      component="footer"
      sx={{
        background: "linear-gradient(to right, #35281f, #462A19)",
        color: "#fafafa",
        pt: { xs: 3, sm: 4, md: 5 },
        pb: { xs: 2, sm: 2, md: 3 },
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 3 }} mb={4}>
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                textAlign: { xs: "center", sm: "left" },
                mb: { xs: 2, sm: 0 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#fafafa",
                  mb: 1.5,
                  fontFamily: '"Oleo Script", cursive',
                  fontSize: { xs: "1.8rem", sm: "2rem", md: "2.2rem" },
                }}
              >
                Erpre Barber & Shop
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  maxWidth: { sm: "90%", md: "100%" },
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Quality grooming services since 2023.
              </Typography>
            </Box>
          </Grid>

          {/* Contact Information Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  position: "relative",
                  display: "inline-block",
                  pb: 1,
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "40px",
                    height: "3px",
                    backgroundColor: "#e6853b",
                    bottom: 0,
                    left: { xs: "calc(50% - 20px)", sm: 0 },
                  },
                }}
              >
                Contact Information
              </Typography>
              <Stack
                spacing={1.5}
                sx={{
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                <ContactItem
                  icon={<PhoneIcon sx={{ fontSize: { xs: 18, md: 20 } }} />}
                  text={shopInfo?.phone || "Not available"}
                />
                <ContactItem
                  icon={<EmailIcon sx={{ fontSize: { xs: 18, md: 20 } }} />}
                  text={shopInfo?.email || "Not available"}
                />
                <ContactItem
                  icon={
                    <LocationOnIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                  }
                  text={
                    isXSmall
                      ? shopInfo?.address || ""
                      : `${shopInfo?.address || ""}, ${shopInfo?.city || ""}, ${
                          shopInfo?.province || ""
                        } ${shopInfo?.postal_code || ""}`
                  }
                />
                <ContactItem
                  icon={
                    <AccessTimeIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                  }
                  text="Mon-Sat: 9AM-9PM"
                />
              </Stack>
            </Box>
          </Grid>

          {/* Social Links & Quick Links Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1.5,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  position: "relative",
                  display: "inline-block",
                  pb: 1,
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "40px",
                    height: "3px",
                    backgroundColor: "#e6853b",
                    bottom: 0,
                    left: { xs: "calc(50% - 20px)", md: 0 },
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
                  mt: 2,
                }}
              >
                <SocialIcon
                  icon={<InstagramIcon />}
                  href="https://instagram.com"
                />
                <SocialIcon
                  icon={<FacebookIcon />}
                  href="https://facebook.com"
                />
                <SocialIcon icon={<TwitterIcon />} href="https://twitter.com" />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  mb: 1.5,
                  mt: 3,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  position: "relative",
                  display: "inline-block",
                  pb: 1,
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "40px",
                    height: "3px",
                    backgroundColor: "#e6853b",
                    bottom: 0,
                    left: { xs: "calc(50% - 20px)", md: 0 },
                  },
                }}
              >
                Quick Links
              </Typography>

              <Stack
                direction="row"
                spacing={3}
                justifyContent={{ xs: "center", md: "flex-start" }}
                sx={{ mt: 2 }}
              >
                <FooterLink href="/" text="Home" />
                <FooterLink href="/#about" text="About" />
                <FooterLink href="/#reviews" text="Reviews" />
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            mb: { xs: 2, md: 3 },
            mt: { xs: 2, md: 1 },
            bgcolor: "rgba(255,255,255,0.2)",
          }}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#fafafa",
            opacity: 0.8,
            fontSize: { xs: "0.75rem", md: "0.875rem" },
          }}
        >
          © {new Date().getFullYear()} Erpre Barber and Shop. All rights
          reserved.
        </Typography>
      </Container>
    </Box>
  );
};

// Helper components remain unchanged
const ContactItem = ({ icon, text }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "translateX(5px)",
      },
    }}
  >
    <Box
      sx={{
        color: "#e6853b",
        display: "flex",
        alignItems: "center",
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="body2"
      sx={{
        fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.925rem" },
        opacity: 0.9,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
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
      mr: 1.5,
      color: "#fafafa",
      bgcolor: "rgba(255,255,255,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        bgcolor: "#e6853b",
        transform: "translateY(-3px)",
      },
      width: { xs: 36, md: 40 },
      height: { xs: 36, md: 40 },
    }}
  >
    {icon}
  </IconButton>
);

const FooterLink = ({ href, text }) => (
  <Link
    href={href}
    color="inherit"
    underline="hover"
    sx={{
      fontWeight: 500,
      fontSize: { xs: "0.85rem", md: "0.95rem" },
      opacity: 0.9,
      transition: "all 0.2s ease",
      "&:hover": {
        color: "#e6853b",
        transform: "translateX(3px)",
      },
      display: "inline-block",
    }}
  >
    {text}
  </Link>
);

export default Footer;
