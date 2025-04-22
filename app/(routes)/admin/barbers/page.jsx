"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminLayout from "@/app/components/AdminLayout";
import AdminNavBar from "@/app/components/AdminNavBar";

const roleColors = {
  User: "default",
  Admin: "warning",
  Barber: "success",
};

export default function BarberRoleManagement() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAssign, setOpenAssign] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Fetch all barbers with error handling
  const fetchBarbers = async () => {
    setLoading(true);
    try {
      // Using the consolidated API endpoint with no parameters to get all barbers
      const response = await fetch("/api/barbers");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch barbers");
      }
      const data = await response.json();
      setBarbers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search user by email with validation
  const searchUserByEmail = async () => {
    if (!searchEmail.trim()) {
      setEmailError("Please enter an email address");
      return;
    }
    if (!validateEmail(searchEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setEmailError("");
    setLoading(true);
  
    try {
      const response = await fetch(`/api/users?action=byEmail&email=${encodeURIComponent(searchEmail)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to find user");
      }
      
      const user = await response.json();
      console.log("API Response:", user); // Debug log
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Transform the user object to match your expected format
      setFoundUser({
        ...user,
        currentRole: user.IsBarber ? "Barber" : user.IsAdmin ? "Admin" : "User",
        name: user.name || "No name provided",
        barber_id: user.user_id // Map user_id to barber_id if needed
      });
      
    } catch (err) {
      setEmailError(err.message);
      setFoundUser(null);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignBarberRole = async () => {
    if (!foundUser) return;
    setLoading(true);
    try {
      // 1. Update user's IsBarber flag
      const updateResponse = await fetch(`/api/users?userId=${foundUser.user_id}&action=makeBarber`, {
        method: "PUT",  // Changed to PUT to match your API route
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: foundUser.name,
          email: foundUser.email
        })
      });
  
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update user role");
      }
  
      const result = await updateResponse.json();
      
      // 2. Update local state
      setBarbers(prev => [...prev, {
        ...result.barber,
        currentRole: "Barber",
        barber_id: result.barber.barber_id || result.barber.id
      }]);
      
      setSnackbar({
        open: true,
        message: `${foundUser.name} is now a Barber!`,
        severity: "success",
      });
  
      setOpenAssign(false);
      setSearchEmail("");
      setFoundUser(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Format time display
  const formatTimeDisplay = (time) => {
    if (!time) return "Not available";
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    return `${hourNum % 12 || 12}:${minutes} ${hourNum >= 12 ? 'PM' : 'AM'}`;
  };

  // Render day schedule
  const renderDaySchedule = (day, start, end) => (
    <Box display="flex" justifyContent="space-between" mb={0.5}>
      <Typography variant="caption" fontWeight="medium">
        {day}:
      </Typography>
      <Typography variant="caption">
        {start ? `${formatTimeDisplay(start)} - ${formatTimeDisplay(end)}` : 'Closed'}
      </Typography>
    </Box>
  );

  useEffect(() => {
    fetchBarbers();
  }, []);

  return (
    <AdminLayout title="Barber Role Management">
      <AdminNavBar />
      <Container sx={{ py: 4 }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          mb={4}
        >
          <Typography variant="h4" fontWeight="bold">
            Manage Barber Roles
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenAssign(true)}
            sx={{
              bgcolor: "#5F402C",
              "&:hover": { bgcolor: "#452B1F" },
              textTransform: "none",
              px: 3,
            }}
          >
            Assign Barber Role
          </Button>
        </Stack>

        {/* Barber Cards with Days */}
        {loading && !barbers.length ? (
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={300} animation="wave" />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Typography color="error" textAlign="center">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {barbers.map((b) => (
              <Grid item xs={12} sm={6} md={4} key={b.id}>
                <Card sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <CardHeader
                    avatar={<Avatar>{b.name.charAt(0)}</Avatar>}
                    title={<Typography variant="h6">{b.name}</Typography>}
                    subheader={b.email}
                    sx={{ pb: 0 }}
                  />
                  <CardContent sx={{ pt: 1, flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <Chip label={b.currentRole || "Barber"} color={roleColors[b.currentRole || "Barber"]} size="small" />
                    </Stack>

                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>Working Hours:</Typography>
                      {renderDaySchedule("Monday", b.Monday_Start || b.mondayStart, b.Monday_End || b.mondayEnd)}
                      {renderDaySchedule("Tuesday", b.Tuesday_Start || b.tuesdayStart, b.Tuesday_End || b.tuesdayEnd)}
                      {renderDaySchedule("Wednesday", b.Wednesday_Start || b.wednesdayStart, b.Wednesday_End || b.wednesdayEnd)}
                      {renderDaySchedule("Thursday", b.Thursday_Start || b.thursdayStart, b.Thursday_End || b.thursdayEnd)}
                      {renderDaySchedule("Friday", b.Friday_Start || b.fridayStart, b.Friday_End || b.fridayEnd)}
                      {renderDaySchedule("Saturday", b.Saturday_Start || b.saturdayStart, b.Saturday_End || b.saturdayEnd)}
                      {renderDaySchedule("Sunday", b.Sunday_Start || b.sundayStart, b.Sunday_End || b.sundayEnd)}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={() => {
                        setSearchEmail(b.email);
                        setOpenAssign(true);
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      Change Role
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Assign Role Dialog */}
        <Dialog
          open={openAssign}
          onClose={() => setOpenAssign(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            Find User
            <IconButton
              aria-label="close"
              onClick={() => setOpenAssign(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="User Email"
              fullWidth
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError || "Enter a user's email to search"}
              autoFocus
              sx={{ mb: 2 }}
            />
            {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
            
            {!loading && foundUser && (
              <Box display="flex" alignItems="center" mt={2}>
                <Avatar sx={{ mr: 2 }}>
                  {foundUser.name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography>{foundUser.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {foundUser.email}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip 
                      label={foundUser.currentRole} 
                      color={roleColors[foundUser.currentRole]} 
                      size="small" 
                    />
                    {foundUser.phone_number && (
                      <Chip 
                        label={`Phone: ${foundUser.phone_number}`} 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
            )}
    
            {!loading && !foundUser && emailError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {emailError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenAssign(false)}>Cancel</Button>
            {foundUser ? (
              <Button
                variant="contained"
                onClick={assignBarberRole}
                disabled={loading}
                startIcon={<PersonAddIcon />}
                sx={{
                  bgcolor: "#5F402C",
                  "&:hover": { bgcolor: "#452B1F" },
                  textTransform: "none",
                }}
              >
                Assign as Barber
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={searchUserByEmail}
                disabled={loading || !searchEmail}
                sx={{
                  bgcolor: "#5F402C",
                  "&:hover": { bgcolor: "#452B1F" },
                  textTransform: "none",
                }}
              >
                Search
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AdminLayout>
  );
}