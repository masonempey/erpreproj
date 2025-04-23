"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

export default function AddBarberService() {
  const [services, setServices] = useState([]);
  const [barberServices, setBarberServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    price: "",
    durationMinutes: "",
  });
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const barberId = "barber2";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, barberServicesRes] = await Promise.all([
          fetch(`/api/services?action=available&barberId=${barberId}`),
          fetch(`/api/services?action=barberServices&barberId=${barberId}`),
        ]);

        if (!servicesRes.ok || !barberServicesRes.ok) {
          throw new Error("Failed to fetch services");
        }

        const servicesData = await servicesRes.json();
        const barberServicesData = await barberServicesRes.json();

        setServices(servicesData);
        setBarberServices(barberServicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        barberId,
        serviceId: parseInt(formData.serviceId, 10),
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes, 10),
        action: editingService ? "updateBarberService" : "addBarberService",
      };

      const response = await fetch("/api/services", {
        method: editingService ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save barber service");
      }

      const result = await response.json();
      if (editingService) {
        setBarberServices((prev) =>
          prev.map((bs) =>
            bs.service_id === payload.serviceId ? result.barberService : bs
          )
        );
      } else {
        setBarberServices((prev) => [...prev, result.barberService]);
        setServices((prev) => prev.filter((s) => s.id !== payload.serviceId));
      }

      setSuccess(true);
      setFormData({ serviceId: "", price: "", durationMinutes: "" });
      setEditingService(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceId: service.service_id,
      price: service.price,
      durationMinutes: service.duration_minutes,
    });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setFormData({ serviceId: "", price: "", durationMinutes: "" });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#35281f" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {editingService ? "Edit Barber Service" : "Add Barber Service"}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Service {editingService ? "updated" : "added"} successfully!
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!!editingService}>
          <InputLabel id="service-select-label">Service</InputLabel>
          <Select
            labelId="service-select-label"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleInputChange}
            label="Service"
            required
          >
            {services.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.service_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              backgroundColor: "#35281f",
              "&:hover": { backgroundColor: "#4a3c32" },
            }}
          >
            {editingService ? "Update Service" : "Add Service"}
          </Button>
          {editingService && (
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
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        My Services
      </Typography>
      {barberServices.length === 0 ? (
        <Typography>No services added yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Duration (minutes)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {barberServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.service_name}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{service.duration_minutes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(service)}>
                    <EditIcon />
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