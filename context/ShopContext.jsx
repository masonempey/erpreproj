"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShopInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/shop");
      if (!response.ok) {
        throw new Error(`Failed to fetch shop info: ${response.status}`);
      }
      const info = await response.json();
      setShopInfo(info);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch shop info:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateShopInfo = async (updatedData) => {
    try {
      setLoading(true);
      // Changed from PUT to POST with action parameter
      const response = await fetch("http://localhost:3000/api/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateInfo",
          ...updatedData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update shop info: ${response.status}`);
      }

      const result = await response.json();
      setShopInfo(result);
      return true;
    } catch (err) {
      console.error("Failed to update shop info:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  // check if a time is within business hours
  const isWithinBusinessHours = (date, timeString) => {
    if (!shopInfo) {
      return false;
    }

    // Get day of the week
    const dayOfWeek = date.day();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[dayOfWeek];

    // Get business hours for that day
    const openTime = shopInfo[`${dayName}_open`];
    const closeTime = shopInfo[`${dayName}_close`];

    // If shop is closed that day
    if (!openTime || !closeTime) {
      return false;
    }

    // convert time to hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Parse open/close times
    const [openHours, openMinutes] = openTime.split(":").map(Number);
    const [closeHours, closeMinutes] = closeTime.split(":").map(Number);

    // Convert to minutes since midnight for easy comparison
    const timeInMinutes = hours * 60 + minutes;
    const openInMinutes = openHours * 60 + openMinutes;
    const closeInMinutes = closeHours * 60 + closeMinutes;

    // Check if time is within business hours
    return timeInMinutes >= openInMinutes && timeInMinutes < closeInMinutes;
  };

  return (
    <ShopContext.Provider
      value={{
        shopInfo,
        loading,
        error,
        fetchShopInfo,
        updateShopInfo,
        isWithinBusinessHours,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
