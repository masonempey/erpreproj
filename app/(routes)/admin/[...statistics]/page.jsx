"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import AdminLayout from "@/app/components/AdminLayout";
import AdminNavBar from "@/app/components/AdminNavBar";
import BarberPanel from "@/app/components/AdminBarberPanel";
import PersonIcon from "@mui/icons-material/Person";

export default function Statistics({ params }) {
  const [selectedBarber, setSelectedBarber] = useState(
    params?.statistics?.[0] || null
  );
  const [barberData, setBarberData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBarberStats = async () => {
      if (!selectedBarber) return;

      setLoading(true);
      try {
        // This would be replaced with your actual endpoint
        const response = await fetch(
          `/api/barbers/${selectedBarber}/statistics`
        );
        if (response.ok) {
          const data = await response.json();
          setBarberData(data);
        }
      } catch (error) {
        console.error("Failed to fetch barber statistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarberStats();
  }, [selectedBarber]);

  const handleBarberSelect = (barberId) => {
    setSelectedBarber(barberId);
  };

  return (
    <AdminLayout title="Barber Statistics">
      <AdminNavBar />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Select Barber
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <BarberPanel
              onBarberSelect={handleBarberSelect}
              selectedBarber={selectedBarber}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Performance Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {selectedBarber ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      bgcolor: "#fafafa",
                      boxShadow: "0 4px 10px rgba(53, 40, 31, 0.1)",
                    }}
                  >
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Appointments
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ color: "#35281f", fontWeight: "bold" }}
                      >
                        {barberData?.totalAppointments || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      bgcolor: "#fafafa",
                      boxShadow: "0 4px 10px rgba(53, 40, 31, 0.1)",
                    }}
                  >
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Revenue Generated
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ color: "#35281f", fontWeight: "bold" }}
                      >
                        ${barberData?.revenue?.toFixed(2) || "0.00"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Recent Clients
                  </Typography>
                  <List>
                    {(barberData?.recentClients || Array(3).fill({})).map(
                      (client, index) => (
                        <ListItem key={index} divider={index < 2}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "#e6853b" }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={client?.name || "Sample Client"}
                            secondary={client?.date || "Recent appointment"}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  Select a barber to view statistics
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
