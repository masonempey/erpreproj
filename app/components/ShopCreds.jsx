"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const ShopCreds = () => {
  const [shopCredentials, setShopCredentials] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCredentials = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/shop");
        if (!response.ok) throw new Error("Failed to fetch shop data");

        const data = await response.json();
        setShopCredentials(data);
        setFormData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching shop credentials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCredentials();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/shop", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update shop data");

      const updatedData = await response.json();
      setShopCredentials(updatedData);
      setIsEditing(false);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Error updating shop credentials:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) setFormData(shopCredentials); // Reset form data if canceling
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading && !shopCredentials) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#35281f" }} />
      </Box>
    );
  }

  // Fallback data for development
  const credentials = shopCredentials || {
    name: "Sample Shop Name",
    address: "123 Main St, City, State",
    phone: "(123) 456-7890",
    email: "sample@shop.com",
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Shop details updated successfully!
        </Alert>
      )}

      {isEditing ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Shop Name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={toggleEdit}
                startIcon={<CancelIcon />}
                sx={{
                  borderColor: "#35281f",
                  color: "#35281f",
                  "&:hover": {
                    borderColor: "#4a3c32",
                    backgroundColor: "rgba(53, 40, 31, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  backgroundColor: "#35281f",
                  "&:hover": {
                    backgroundColor: "#4a3c32",
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Shop Name:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {credentials.shop_name}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Phone:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {credentials.phone}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {credentials.email}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Address:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {credentials.address}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={toggleEdit}
            startIcon={<EditIcon />}
            sx={{
              mt: 3,
              backgroundColor: "#35281f",
              "&:hover": {
                backgroundColor: "#4a3c32",
              },
            }}
          >
            Edit Details
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ShopCreds;
