"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, Tab, Paper, Box } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  BarChart as ChartIcon,
} from "@mui/icons-material";
import ContentCutIcon from '@mui/icons-material/ContentCut';

const AdminNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(0);

  // Navigation items with correct routes
  const navItems = [
    { name: "Home", href: "/admin", icon: <DashboardIcon /> },
    { name: "Management", href: "/admin/managment", icon: <SettingsIcon /> },
    { name: "Statistics", href: "/admin/statistics", icon: <ChartIcon /> },
    { name: "Barbers", href: "/admin/barbers", icon: <ContentCutIcon />},
    { name: "Profile", href: "/admin/profile", icon: <PersonIcon /> },
  ];

  // Update active tab when path changes
  useEffect(() => {
    const currentPath = pathname || "";
    const activeIndex = navItems.findIndex(
      (item) =>
        currentPath === item.href ||
        (item.href !== "/admin" && currentPath.startsWith(item.href)) ||
        (item.href === "/admin" && currentPath === "/admin")
    );

    if (activeIndex !== -1) {
      setActiveTab(activeIndex);
    }
  }, [pathname]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Update state immediately for smooth UI
    router.push(navItems[newValue].href);
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: "#fafafa",
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              backgroundColor: "#e6853b",
              height: 3, // Make indicator more visible
            },
            "& .Mui-selected": {
              color: "#35281f !important",
              fontWeight: "bold",
            },
          }}
        >
          {navItems.map((item) => (
            <Tab
              key={item.name}
              icon={item.icon}
              label={item.name.toUpperCase()}
              iconPosition="start"
              sx={{
                textTransform: "none",
                minHeight: 64,
                transition: "color 0.3s ease",
              }}
            />
          ))}
        </Tabs>
      </Paper>
    </Box>
  );
};

export default AdminNavBar;
