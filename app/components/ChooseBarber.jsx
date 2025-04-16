"use client";

import { useState, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FiberManualRecord as StatusIcon } from "@mui/icons-material";

// Hard-coded for now, but we will later get the images from the database
const barberImages = {
  Anthony: "/images/barbers/Anthony.png",
  Carl: "/images/barbers/Carl.png",
  George: "/images/barbers/George.png",
  Guio: "/images/barbers/Guio.png",
  Rogin: "/images/barbers/Rogin.png",
};

export default function ChooseBarber() {
  const { state, dispatch } = useBooking();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch barbers
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/barbers");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        console.log("Barbers data:", data);

        // Add availability field for UI (in a real app, this would come from backend)
        const barbersWithAvailability = data.map((barber) => ({
          ...barber,
          isAvailable: Math.random() > 0.3, // Random availability for demo
        }));

        setBarbers(barbersWithAvailability);
      } catch (error) {
        console.error("Error fetching barbers:", error);
        setError(`Failed to load barbers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  const handleBarberSelect = (name, id) => {
    console.log(`Selected barber: ${name} with ID: ${id}`);
    dispatch({
      type: "SELECT_BARBER",
      payload: { name: name, id: id },
    });
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#35281f" }} />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );

  if (!barbers || barbers.length === 0)
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No barbers available
      </Alert>
    );

  return (
    <Box sx={{ px: 2, py: 1, maxHeight: "65vh", overflow: "auto" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Choose Your Barber
      </Typography>

      <Grid container spacing={3}>
        {barbers.map((barber) => (
          <Grid item xs={12} sm={6} md={4} key={barber.id}>
            <Card
              raised={state.barberId === barber.barber_id}
              onClick={() => handleBarberSelect(barber.name, barber.barber_id)}
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform:
                  state.barberId === barber.barber_id
                    ? "translateY(-5px)"
                    : "none",
                border:
                  state.barberId === barber.barber_id
                    ? "2px solid #35281f"
                    : "none",
                backgroundColor:
                  state.barberId === barber.barber_id
                    ? "rgba(53, 40, 31, 0.05)"
                    : "white",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 16px rgba(53, 40, 31, 0.15)",
                },
              }}
            >
              <CardActionArea>
                <Box
                  sx={{
                    pt: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={barberImages[barber.name]}
                    alt={barber.name}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "3px solid #f0f0f0",
                    }}
                  />
                </Box>

                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {barber.name}
                  </Typography>

                  <Chip
                    icon={
                      <StatusIcon
                        fontSize="small"
                        sx={{
                          color: barber.isAvailable ? "#4CAF50" : "#FFA000",
                          "& .MuiChip-icon": { marginLeft: 0 },
                        }}
                      />
                    }
                    label={
                      barber.isAvailable ? "Available" : "Limited Availability"
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: barber.isAvailable
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(255, 160, 0, 0.1)",
                      borderColor: barber.isAvailable ? "#4CAF50" : "#FFA000",
                      color: barber.isAvailable ? "#1B5E20" : "#E65100",
                    }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
