"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const BarberPanel = ({ onBarberSelect, selectedBarber, isDashboard = false }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/barbers");
        if (!response.ok) throw new Error("Failed to fetch barbers");
        const data = await response.json();
        setBarbers(data);
      } catch (err) {
        console.error("Error fetching barbers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  const handleBarberClick = (barberId) => {
    if (isDashboard) {
      router.push("/admin/statistics"); // Fixed to /admin/statistics
    } else if (onBarberSelect) {
      onBarberSelect(barberId);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#35281f" }} />
      </Box>
    );
  }

  const barbersToDisplay =
    barbers.length > 0
      ? barbers
      : [
          { id: 1, barber_id: "b1", name: "John Smith" },
          { id: 2, barber_id: "b2", name: "David Miller" },
          { id: 3, barber_id: "b3", name: "Robert Johnson" },
        ];

  return (
    <Box>
      <List disablePadding>
        {barbersToDisplay.map((barber, index) => (
          <React.Fragment key={barber.id || barber.barber_id}>
            <ListItem
              button
              onClick={() => handleBarberClick(barber.barber_id)}
              selected={!isDashboard && selectedBarber === barber.barber_id}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "rgba(230, 133, 59, 0.15)",
                },
                "&:hover": {
                  backgroundColor: "rgba(53, 40, 31, 0.05)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#35281f" }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={barber.name}
                secondary={`Barber ID: ${barber.barber_id}`}
              />
            </ListItem>
            {index < barbersToDisplay.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default BarberPanel;