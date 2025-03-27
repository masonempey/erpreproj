"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
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
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
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
          setUser({
            ...authUser,
            uid: authUser.uid,
            email: authUser.email,
            name: authUser.displayName,
          });
          setUserRole("user"); // Default role
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper functions for role-based access control
  const hasRole = (role) => {
    return userRole === role;
  };

  const isAdmin = () => {
    return userRole === "admin";
  };

  const isBarber = () => {
    return userRole === "barber";
  };

  const isUser = () => {
    return userRole === "user";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        userRole,
        hasRole,
        isAdmin,
        isBarber,
        isUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
