"use client";

import { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  CardActionArea,
  Grid,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function SelectService() {
  const { state, dispatch } = useBooking();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no barber is selected, redirect back to step 1
    if (!state.barberId) {
      dispatch({ type: "GO_BACK" });
      return;
    }

    const fetchBarberServices = async () => {
      try {
        setLoading(true);
        // Use the new endpoint to get services for the selected barber
        const response = await fetch(
          `/api/barbers?action=services&barberId=${state.barberId}`
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log("Barber services data:", data);

        // Store services with defaults for missing values
        setServices(
          data.map((service) => ({
            ...service,
            duration_minutes: service.duration_minutes || 45,
            price: service.price || 0,
          }))
        );
      } catch (error) {
        console.error("Error fetching barber services:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBarberServices();
  }, [state.barberId, dispatch]);

  const handleServiceSelect = (serviceName, serviceId, duration, price) => {
    dispatch({
      type: "SELECT_SERVICE",
      payload: {
        name: serviceName,
        id: serviceId,
        duration: duration,
        price: price,
      },
    });
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#35281f" }} />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );

  if (!services || services.length === 0)
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        This barber does not offer any services yet.
      </Alert>
    );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Select a Service with {state.barber}
      </Typography>

      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card
              raised={state.serviceId === service.id}
              onClick={() =>
                handleServiceSelect(
                  service.service_name,
                  service.id,
                  service.duration_minutes,
                  service.price
                )
              }
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform:
                  state.serviceId === service.id ? "translateY(-5px)" : "none",
                border:
                  state.serviceId === service.id ? "2px solid #35281f" : "none",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardActionArea sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {service.service_name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AttachMoneyIcon
                      sx={{ fontSize: 20, mr: 0.5, color: "text.secondary" }}
                    />
                    <Typography variant="h5" color="primary">
                      ${service.price}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {service.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 2,
                      color: "text.secondary",
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {service.duration_minutes} minutes
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
