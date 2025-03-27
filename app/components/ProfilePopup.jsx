"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import RedeemIcon from "@mui/icons-material/Redeem";
import Image from "next/image";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePopup = () => {
  const { user, loading: userLoading, logout, refreshUserData } = useUser();

  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [coins, setCoins] = useState(0);
  const [redeemRewards, setRedeemRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name || "",
        phone: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 2) {
      fetchUserAppointments();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleClose();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  useEffect(() => {
    if (open && user) {
      fetchUserData();
    }
  }, [open, user]);

  const fetchUserData = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setCoins(data.coins || 0);

      // Update user profile if available
      if (data.name) setUserProfile((prev) => ({ ...prev, name: data.name }));
      if (data.phone_number)
        setUserProfile((prev) => ({ ...prev, phone: data.phone_number }));
      if (data.address)
        setUserProfile((prev) => ({ ...prev, address: data.address }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAppointments = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/appointments/users/${user.uid}/appointments`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpendCoins = async (amount, rewardName) => {
    if (coins < amount) {
      alert("Not enough coins!");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.uid}/coins/redeem`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coins: amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to update coins");
      }

      const data = await response.json();
      setCoins(data.coins);
      setRedeemRewards((prevRewards) => [...prevRewards, rewardName]);

      refreshUserData && refreshUserData(user);
    } catch (error) {
      console.error("Error updating coins:", error);
      alert("Failed to update coins. Please try again.");
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userProfile.name,
          phone_number: userProfile.phone,
          address: userProfile.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      refreshUserData && refreshUserData(user);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const rewards = [
    { name: "Free Haircut", cost: 100 },
    { name: "30% Off Next Visit", cost: 75 },
    { name: "Styling Product", cost: 50 },
    { name: "Beard Trim", cost: 40 },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      <Avatar
        sx={{
          bgcolor: "#fafafa",
          color: "#35281f",
          cursor: "pointer",
          transition: "transform 0.2s ease",
          border: "1px solid #E0E0E0",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 2px 4px rgba(53, 40, 31, 0.2)",
          },
        }}
        onClick={handleOpen}
      >
        <PersonIcon />
      </Avatar>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(53, 40, 31, 0.1)",
            padding: "1rem",
          }}
        >
          <Typography variant="h5" sx={{ color: "#35281f", fontWeight: 600 }}>
            My Profile
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "#35281f" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#35281f",
              },
              "& .Mui-selected": {
                color: "#35281f !important",
                fontWeight: "bold",
              },
            }}
          >
            <Tab
              icon={<AccountBoxIcon />}
              label="PROFILE"
              iconPosition="start"
              sx={{ textTransform: "none", fontSize: "1rem" }}
            />
            <Tab
              icon={<MonetizationOnIcon />}
              label="REWARDS"
              iconPosition="start"
              sx={{ textTransform: "none", fontSize: "1rem" }}
            />
            <Tab
              icon={<CalendarTodayIcon />}
              label="APPOINTMENTS"
              iconPosition="start"
              sx={{ textTransform: "none", fontSize: "1rem" }}
            />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress sx={{ color: "#35281f" }} />
          </Box>
        ) : (
          <>
            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Personal Information</Typography>
                  <IconButton
                    onClick={() => setEditMode(!editMode)}
                    sx={{ color: "#35281f" }}
                  >
                    {editMode ? (
                      <SaveIcon onClick={saveProfile} />
                    ) : (
                      <EditIcon />
                    )}
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={userProfile.name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    fullWidth
                    variant={editMode ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />

                  <TextField
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    fullWidth
                    variant="filled"
                  />

                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={userProfile.phone}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    fullWidth
                    variant={editMode ? "outlined" : "filled"}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />

                  <TextField
                    label="Address"
                    name="address"
                    value={userProfile.address}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    fullWidth
                    variant={editMode ? "outlined" : "filled"}
                    multiline
                    rows={2}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    onClick={handleLogout}
                    fullWidth
                    sx={{
                      backgroundColor: "#35281f",
                      "&:hover": {
                        backgroundColor: "#4a3c32",
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            {/* Rewards Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Your Barber Coins: <strong>{coins}</strong>
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Available Rewards
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {rewards.map((reward, index) => (
                    <Card
                      key={index}
                      sx={{
                        width: 200,
                        boxShadow: "0 4px 8px rgba(53, 40, 31, 0.1)",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 16px rgba(53, 40, 31, 0.2)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {reward.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 1,
                            mb: 2,
                          }}
                        >
                          <MonetizationOnIcon
                            sx={{ color: "#E6853B", mr: 1 }}
                          />
                          <Typography>{reward.cost} coins</Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<RedeemIcon />}
                          disabled={coins < reward.cost}
                          onClick={() =>
                            handleSpendCoins(reward.cost, reward.name)
                          }
                          sx={{
                            backgroundColor: "#35281f",
                            "&:hover": {
                              backgroundColor: "#4a3c32",
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "#cccccc",
                            },
                          }}
                        >
                          Redeem
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {redeemRewards.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Your Redeemed Rewards
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                      <List>
                        {redeemRewards.map((reward, index) => (
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "#E6853B" }}>
                                <RedeemIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={reward}
                              secondary="Redeemed"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Appointments Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Your Appointments
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {appointments.length > 0 ? (
                  <List>
                    {appointments.map((appointment, index) => (
                      <Paper
                        key={index}
                        elevation={2}
                        sx={{ mb: 2, overflow: "hidden", borderRadius: "8px" }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#35281f",
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle1">
                            Appointment #{appointment.id}
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(appointment.date)}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2 }}>
                          <Typography>
                            <strong>Service:</strong>{" "}
                            {appointment.service_name || "Not specified"}
                          </Typography>
                          <Typography>
                            <strong>Barber:</strong>{" "}
                            {appointment.barber_name || "Not specified"}
                          </Typography>
                          <Typography>
                            <strong>Status:</strong>{" "}
                            {appointment.status || "Confirmed"}
                          </Typography>

                          {appointment.duration_minutes && (
                            <Typography>
                              <strong>Duration:</strong>{" "}
                              {appointment.duration_minutes} minutes
                            </Typography>
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              mt: 2,
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={appointment.isPast}
                              sx={{
                                borderColor: "#35281f",
                                color: "#35281f",
                                mr: 1,
                                "&:hover": {
                                  borderColor: "#4a3c32",
                                  backgroundColor: "rgba(53, 40, 31, 0.04)",
                                },
                                "&.Mui-disabled": {
                                  opacity: 0.5,
                                },
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              disabled={appointment.isPast}
                              sx={{
                                backgroundColor: "#35281f",
                                "&:hover": {
                                  backgroundColor: "#4a3c32",
                                },
                                "&.Mui-disabled": {
                                  opacity: 0.5,
                                },
                              }}
                            >
                              Reschedule
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      You don't have any appointments yet.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "#35281f",
                        "&:hover": {
                          backgroundColor: "#4a3c32",
                        },
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                )}
              </Box>
            </TabPanel>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ProfilePopup;
