"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import AdminLayout from "@/app/components/AdminLayout";
import AdminNavBar from "@/app/components/AdminNavBar";
import AdminDayView from "@/app/components/AdminDayView";
import BarberPanel from "@/app/components/AdminBarberPanel";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";

export default function AdminDashboard() {
  const { user } = useUser();
  const [todayAppointments, setTodayAppointments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch today's appointments using consolidated API
  useEffect(() => {
    const fetchTodayAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Use the new consolidated API route
        const response = await fetch(`/api/bookings?action=date&date=${today}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status}`);
        }

        const todayApps = await response.json();
        setTodayAppointments(todayApps.length);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, []);

  const stats = [
    {
      period: "Today",
      value: todayAppointments !== null ? todayAppointments : "Loading...",
    },
    { period: "This Week", value: "N/A" },
    { period: "This Month", value: "N/A" },
    { period: "Total", value: "N/A" },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <AdminNavBar />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{ p: 2, borderRadius: 2, height: "100%", minHeight: 400 }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Today's Schedule
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <AdminDayView />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{ p: 2, borderRadius: 2, height: "100%", minHeight: 400 }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Barber Team
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <BarberPanel isDashboard={true} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Quick Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading && todayAppointments === null ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress sx={{ color: "#35281f" }} />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
                {error}
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Card
                      sx={{
                        bgcolor: "#fafafa",
                        boxShadow: "0 4px 10px rgba(53, 40, 31, 0.1)",
                      }}
                    >
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          {stat.period} Appointments
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ color: "#35281f", fontWeight: "bold" }}
                        >
                          {stat.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
