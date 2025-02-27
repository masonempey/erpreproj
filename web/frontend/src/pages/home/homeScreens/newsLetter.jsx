import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    // Add newsletter signup logic here
    setStatus("success");
    setEmail("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: "3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#35281f",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Subscribe to Our Newsletter
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#666",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        Stay updated with our latest news, promotions, and special offers!
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          maxWidth: "500px",
          marginTop: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={status === "error"}
          helperText={status === "error" ? "Please enter a valid email" : ""}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#35281f",
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#35281f",
            color: "#fafafa",
            "&:hover": {
              backgroundColor: "#fafafa",
              color: "#35281f",
              border: "1px solid #35281f",
            },
          }}
        >
          Subscribe
        </Button>
      </Box>

      {status === "success" && (
        <Alert severity="success" sx={{ width: "100%", maxWidth: "500px" }}>
          Thank you for subscribing!
        </Alert>
      )}
    </Paper>
  );
}

// OLD NEWSLETTER (MAY GO BACK)
// export default function NewsLetter() {
//     const information = [
//         {title: "20% Off Haircuts!", date: "Ends: February 20th 2025", description: "To celebrate our new app we are offering 25% off to anyone who makes an account and books an appointment!"},
//         {title: "10% Product Discounts!", date: "Ends: February 25th 2025", description: "In shop products will be 10% off for the time being!"},
//         {title: "Now Hiring!", description: "We are looking for new talent to come and join our team!"},
//         {title: "New System!", description: "We are integrating a new website and discription, please contact us if you experiance any issue."},
//         {title: "Shop closure!", date: "Closed: February 16th"},
//         {title: "Family discounts!", description: "Book a bundle of appointments to recieve a discount."},
//         {title: "Changing opening times!", date: "Starts: February 18th", description: "Shop  will be opening at 8 am instead of 9 am on saturadys."}
//     ]
//     return(
//         <div>
//             <h2 className={newsletterStyles.title}>Erpre Newsletter</h2>
//             <div className={newsletterStyles.newsletterContainer}>
//                 {information.map((point, index) => (
//                     <div key={index} className={newsletterStyles.card}>
//                         <h3>{point.title}</h3>
//                         {point.date && <p className={newsletterStyles.date}>{point.date}</p>}
//                         <p>{point.description}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
