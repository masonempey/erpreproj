"use client";

import { Grid, Paper, Typography, Divider } from "@mui/material";
import AdminLayout from "@/app/components/Admin/AdminLayout";
import AdminNavBar from "@/app/components/Admin/AdminNavBar";
import BarberHours from "@/app/components/Client/Booking/BarberTimeManagment";
import AddBarberService from "@/app/components/Admin/AddBarberService";

export default function Profile({ barberId = "barber2" }) {
  return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Barber Hours
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <BarberHours barberId={barberId} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Manage Services
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <AddBarberService barberId={barberId} />
          </Paper>
        </Grid>
      </Grid>
  );
}