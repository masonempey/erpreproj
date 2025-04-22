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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FiberManualRecord as StatusIcon } from "@mui/icons-material";

// Hard-coded barber images
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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

        // Make all barbers available
        const availableBarbers = data.map((barber) => ({
          ...barber,
          isAvailable: true, // All barbers are available by default
        }));

        setBarbers(availableBarbers);
      } catch (error) {
        console.error("Error fetching barbers:", error);
        setError("Failed to load barbers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  const handleSelectBarber = (barber) => {
    // No need to check availability since all barbers are available
    dispatch({
      type: "SELECT_BARBER",
      payload: { id: barber.barber_id, name: barber.name },
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
        Choose your barber
      </Typography>

      <Grid container spacing={isMobile ? 1.5 : 2}>
        {barbers.map((barber) => (
          <Grid item xs={12} sm={6} md={4} key={barber.barber_id}>
            <Card
              elevation={state.barberId === barber.barber_id ? 3 : 1}
              sx={{
                borderRadius: isMobile ? "10px" : "12px",
                border:
                  state.barberId === barber.barber_id
                    ? "2px solid #35281f"
                    : "1px solid transparent",
                transition: "all 0.2s ease",
                height: "100%",
              }}
            >
              <CardActionArea
                onClick={() => handleSelectBarber(barber)}
                sx={{ height: "100%", p: isMobile ? 1 : 1.5 }}
              >
                <CardContent sx={{ p: 0, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: isMobile ? "column" : "row",
                      mb: 1.5,
                    }}
                  >
                    <Avatar
                      src={barberImages[barber.name] || ""}
                      alt={barber.name}
                      sx={{
                        width: isMobile ? 80 : 100,
                        height: isMobile ? 80 : 100,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        mb: isMobile ? 1.5 : 0,
                        mr: isMobile ? 0 : 2,
                      }}
                    />

                    <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 0.5,
                          fontSize: isMobile ? "1rem" : "1.25rem",
                        }}
                      >
                        {barber.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          justifyContent: isMobile ? "center" : "flex-start",
                        }}
                      >
                        <StatusIcon
                          sx={{
                            fontSize: 12,
                            color: "success.main", // Always show as available
                            mr: 0.5,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.primary"
                          fontSize={isMobile ? "0.75rem" : "0.85rem"}
                        >
                          Available today
                        </Typography>
                      </Box>

                      <Chip
                        label={barber.specialty || "All services"}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          bgcolor: "rgba(53, 40, 31, 0.08)",
                          color: "#35281f",
                          fontWeight: 500,
                          fontSize: isMobile ? "0.7rem" : "0.75rem",
                        }}
                      />
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
