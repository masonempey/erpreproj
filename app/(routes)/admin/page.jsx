"use client";

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
} from "@mui/material";

export default function AdminDashboard() {
  const { user } = useUser();

  return (
    <AdminLayout title="Admin Dashboard">
      <AdminNavBar />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              minHeight: 400,
            }}
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
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              minHeight: 400,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Barber Team
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <BarberPanel />
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
            <Grid container spacing={3}>
              {["Today", "This Week", "This Month", "Total"].map(
                (period, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Card
                      sx={{
                        bgcolor: "#fafafa",
                        boxShadow: "0 4px 10px rgba(53, 40, 31, 0.1)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 20px rgba(53, 40, 31, 0.15)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          {period} Appointments
                        </Typography>
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{ color: "#35281f", fontWeight: "bold" }}
                        >
                          {[8, 42, 156, 2587][index]}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
