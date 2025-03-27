"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import newsletterStyles from "../../../styles/Newsletter.module.css";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // You would replace this with your actual API endpoint
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
        setError("");
      } else {
        setError("Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleClose = () => {
    setSubmitted(false);
  };

  return (
    <Container maxWidth="lg" className={newsletterStyles.newsletterContainer}>
      <Paper elevation={3} className={newsletterStyles.newsletterPaper}>
        <Box className={newsletterStyles.contentWrapper}>
          <Box className={newsletterStyles.textContent}>
            <Typography
              variant="h3"
              className={newsletterStyles.title}
              sx={{
                fontFamily: '"Oleo Script", cursive',
                color: "#35281f",
                mb: 2,
              }}
            >
              Stay Updated
            </Typography>

            <Typography
              variant="body1"
              className={newsletterStyles.description}
            >
              Subscribe to our newsletter for exclusive offers, styling tips,
              and the latest updates from Erpre Barber and Shop.
            </Typography>

            <Box className={newsletterStyles.features}>
              <Box className={newsletterStyles.featureItem}>
                <div className={newsletterStyles.checkmark}>✓</div>
                <Typography variant="body2">
                  Exclusive offers & discounts
                </Typography>
              </Box>
              <Box className={newsletterStyles.featureItem}>
                <div className={newsletterStyles.checkmark}>✓</div>
                <Typography variant="body2">Grooming tips & trends</Typography>
              </Box>
              <Box className={newsletterStyles.featureItem}>
                <div className={newsletterStyles.checkmark}>✓</div>
                <Typography variant="body2">
                  New service announcements
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className={newsletterStyles.formContent}>
            <form onSubmit={handleSubmit} className={newsletterStyles.form}>
              <TextField
                fullWidth
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: "rgba(53, 40, 31, 0.5)" }} />
                  ),
                  className: newsletterStyles.input,
                }}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#e6853b",
                  color: "white",
                  py: 1.5,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#d67b35",
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 15px rgba(230, 133, 59, 0.4)",
                  },
                }}
              >
                Subscribe Now
              </Button>
            </form>

            <Typography variant="caption" className={newsletterStyles.privacy}>
              We respect your privacy. Unsubscribe at any time.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={submitted} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Thank you for subscribing to our newsletter!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewsLetter;
