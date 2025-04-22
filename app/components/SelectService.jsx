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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function SelectService() {
  const { state, dispatch } = useBooking();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    // If no barber is selected, redirect back to step 1
    if (!state.barberId) {
      dispatch({ type: "GO_BACK" });
      return;
    }

    const fetchBarberServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/barbers?action=services&barberId=${state.barberId}`
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();

        // Store services with defaults for missing values
        setServices(
          data.map((service) => ({
            ...service,
            price: service.price || 25,
            duration: service.duration_minutes || 45,
            description:
              service.description ||
              "Standard service with our trained professionals.",
          }))
        );
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarberServices();
  }, [state.barberId, dispatch]);

  const handleSelectService = (service) => {
    dispatch({
      type: "SELECT_SERVICE",
      payload: {
        id: service.id,
        name: service.service_name,
        duration: service.duration_minutes,
        price: service.price,
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 2, mx: isMobile ? 1 : 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ px: isMobile ? 1 : 2, pb: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          textAlign: "center",
          fontSize: isMobile ? "1.1rem" : "1.25rem",
        }}
      >
        Select a service
      </Typography>

      <Grid container spacing={isMobile ? 1.5 : 2}>
        {services.map((service) => (
          <Grid item xs={12} key={service.id}>
            <Card
              elevation={state.serviceId === service.id ? 3 : 1}
              sx={{
                borderRadius: isMobile ? "10px" : "12px",
                border:
                  state.serviceId === service.id
                    ? "2px solid #35281f"
                    : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <CardActionArea
                onClick={() => handleSelectService(service)}
                sx={{ p: isMobile ? 1 : 1.5 }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: isMobile ? "1rem" : "1.25rem",
                      }}
                    >
                      {service.service_name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        fontSize: isMobile ? "0.75rem" : "0.85rem",
                      }}
                    >
                      {service.description}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{ color: "#35281f", mr: 0.5 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: isMobile ? "0.75rem" : "0.85rem",
                          }}
                        >
                          {service.duration_minutes} min
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AttachMoneyIcon
                          fontSize="small"
                          sx={{ color: "#35281f", mr: 0.5 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: isMobile ? "0.85rem" : "0.95rem",
                          }}
                        >
                          ${service.price}
                        </Typography>
                      </Box>
                    </Box>
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
