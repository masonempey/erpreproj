"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase/client";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Add a more comprehensive user setter
  const refreshUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch(`/api/users/${firebaseUser.uid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();

      setUser({
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        uid: firebaseUser.uid,
        name: userData.name,
        coins: userData.coins,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Still set basic user data even if API fails
      setUser({
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch(`/api/users/${firebaseUser.uid}`);
          const userData = await response.json();
          setUser({
            email: userData.email,
            uid: firebaseUser.uid,
            name: userData.name,
            phoneNumber: userData.phone_number,
            coins: userData.coins,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, logout, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};
