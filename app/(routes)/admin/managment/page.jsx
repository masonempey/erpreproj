"use client";

import { Grid, Paper, Typography, Divider } from "@mui/material";
import AdminLayout from "@/app/components/AdminLayout";
import AdminNavBar from "@/app/components/AdminNavBar";
import ShopCreds from "@/app/components/ShopCreds";
import ShopHours from "@/app/components/ShopHours";
import ManageServices from "@/app/components/ManageServices";

export default function Management() {
  return (
    <AdminLayout title="Shop Management">
      <AdminNavBar />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Shop Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <ShopCreds />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#35281f" }}
            >
              Business Hours
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <ShopHours />
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
            <ManageServices />
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}