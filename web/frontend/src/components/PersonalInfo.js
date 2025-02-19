import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function PersonalInfo({ onNext, initialData }) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    address: initialData.address || "",
    phone: initialData.phone || "",
    postalCode: initialData.postalCode || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const missingFields = [];
    if (!formData.fullName) {
      missingFields.push("Full Name");
    }
    if (!formData.email) {
      missingFields.push("Email");
    }
    if (!formData.phone) {
      missingFields.push("Phone Number");
    }

    if (missingFields.length > 0) {
      setError(`Please fill in ${missingFields.join(", ")}`);
      return;
    }
    setError("");
    onNext(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleNext}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "2rem",
      }}
      noValidate
      autoComplete="off"
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            backgroundColor: "rgba(53, 40, 31, 0.1)",
            color: "#35281f",
          }}
        >
          {error}
        </Alert>
      )}
      <TextField
        id="fullName"
        name="fullName"
        label="Full Name"
        variant="outlined"
        value={formData.fullName}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        variant="outlined"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        id="address"
        name="address"
        label="Address"
        variant="outlined"
        value={formData.address}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        id="phone"
        name="phone"
        label="Phone Number"
        variant="outlined"
        value={formData.phone}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        id="postalCode"
        name="postalCode"
        label="Postal Code"
        variant="outlined"
        value={formData.postalCode}
        onChange={handleChange}
        required
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: "2rem",
          backgroundColor: "#35281f",
          color: "#fafafa",
          "&:hover": {
            backgroundColor: "#fafafa",
            color: "#35281f",
          },
        }}
      >
        Next
      </Button>
    </Box>
  );
}
