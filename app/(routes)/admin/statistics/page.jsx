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
  CircularProgress,
} from "@mui/material";
import AdminLayout from "@/app/components/Admin/AdminLayout";
import AdminNavBar from "@/app/components/Admin/AdminNavBar";
import BarberPanel from "@/app/components/Admin/AdminBarberPanel";
import PersonIcon from "@mui/icons-material/Person";

export default function Statistics() {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      setAppointmentsLoading(true);
      try {
        const response = await fetch("/api/bookings?action=list");
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAllAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setAppointmentsLoading(false);
      }
    };
    fetchAllAppointments();
  }, []);

  const barberData =
    selectedBarber && allAppointments.length
      ? (() => {
          const currentDate = new Date();
          const barberAppointments = allAppointments.filter(
            (app) =>
              app.barber_id === selectedBarber &&
              new Date(app.date) < currentDate
          );
          const totalAppointments = barberAppointments.length;

          const recentClients = barberAppointments
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Newest to oldest
            .slice(0, 3)
            .map((app) => ({
              name: app.guest_name || "Unknown Client",
              date: new Date(app.date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));

          return {
            totalAppointments,
            recentClients,
            hasAppointments: barberAppointments.length > 0,
          };
        })()
      : null;

  const handleBarberSelect = (barberId) => {
    setSelectedBarber(barberId);
  };

  return (
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
            {appointmentsLoading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : barberData ? (
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
                        Total Completed Appointments
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ color: "#35281f", fontWeight: "bold" }}
                      >
                        {barberData.totalAppointments}
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
                        sx={{ color: "#35281f", fontWeight: "bold" }}
                      >
                        ${"694.20"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Recent Clients
                  </Typography>
                  {barberData.hasAppointments ? (
                    <List>
                      {barberData.recentClients.map((client, index) => (
                        <ListItem
                          key={index}
                          divider={index < barberData.recentClients.length - 1}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "#e6853b" }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={client.name}
                            secondary={client.date}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No previous appointments
                    </Typography>
                  )}
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
  );
}
