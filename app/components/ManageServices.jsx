"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ManageServices() {
  const [formData, setFormData] = useState({
    id: null,
    serviceName: "",
    description: "",
    price: "",
    durationMinutes: "",
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        serviceName: formData.serviceName,
        description: formData.description,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes, 10),
      };
      if (formData.id) {
        payload.id = formData.id;
      }

      const response = await fetch("/api/services", {
        method: formData.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${formData.id ? "update" : "create"} service`);
      }

      const result = await response.json();
      if (formData.id) {
        setServices((prev) =>
          prev.map((service) =>
            service.id === formData.id ? result.service : service
          )
        );
      } else {
        setServices((prev) => [...prev, result.service]);
      }

      setSuccess(true);
      setFormData({
        id: null,
        serviceName: "",
        description: "",
        price: "",
        durationMinutes: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      id: service.id,
      serviceName: service.service_name,
      description: service.description,
      price: service.price,
      durationMinutes: service.duration_minutes,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service? This will also remove it from all barbers.")) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete service");
      }

      setServices((prev) => prev.filter((service) => service.id !== id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      id: null,
      serviceName: "",
      description: "",
      price: "",
      durationMinutes: "",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#35281f" }} />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Service {formData.id ? "updated" : services.find(s => s.id === formData.id) ? "updated" : "created"} successfully!
        </Alert>
      )}
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
      >
        {formData.id ? "Edit Service" : "Create New Service"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Service Name"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          required
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Price ($)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          fullWidth
          required
          inputProps={{ min: 0, step: "0.01" }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Duration (minutes)"
          name="durationMinutes"
          type="number"
          value={formData.durationMinutes}
          onChange={handleInputChange}
          fullWidth
          required
          inputProps={{ min: 1, step: 1 }}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
            }
            sx={{
              backgroundColor: "#35281f",
              "&:hover": { backgroundColor: "#4a3c32" },
            }}
          >
            {formData.id ? "Update Service" : "Create Service"}
          </Button>
          {formData.id && (
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
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
          )}
        </Box>
      </form>
      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 2, fontWeight: 600, color: "#35281f" }}
      >
        Existing Services
      </Typography>
      {services.length === 0 ? (
        <Typography>No services available.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Duration (minutes)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.service_name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{service.duration_minutes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(service)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(service.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}