"use client";

import { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  CardActionArea,
} from "@mui/material";
import { Scissors } from "@mui/icons-material";

export default function SelectService() {
  const { state, dispatch } = useBooking();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleServiceSelect = (serviceName, serviceId) => {
    dispatch({
      type: "SELECT_SERVICE",
      payload: { name: serviceName, id: serviceId },
    });
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        console.log("Services data:", data);
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!services || services.length === 0)
    return <Alert severity="info">No services available</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card
              raised={state.serviceId === service.id}
              onClick={() =>
                handleServiceSelect(service.service_name, service.id)
              }
              sx={{ height: "100%", cursor: "pointer" }}
            >
              <CardActionArea sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {service.service_name}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    ${service.price}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">{service.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
