"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Fetch user details and role information
          const response = await fetch(`/api/users/${authUser.uid}`);
          if (response.ok) {
            const userData = await response.json();

            // Set user with role information
            setUser({
              ...authUser,
              uid: authUser.uid,
              email: authUser.email,
              name: authUser.displayName || userData.name,
              coins: userData.coins || 0,
              phone: authUser.phoneNumber || userData.phone_number,
              address: userData.address || "",
              roleId: userData.role_id,
            });

            // Fetch role details if role_id exists
            if (userData.role_id) {
              const roleResponse = await fetch(
                `/api/roles/${userData.role_id}`
              );
              if (roleResponse.ok) {
                const roleData = await roleResponse.json();
                setUserRole(roleData.role_type);
              }
            }
          } else {
            console.error("Failed to fetch user data");
            // Still set basic user info from auth
            setUser({
              ...authUser,
              uid: authUser.uid,
              email: authUser.email,
              name: authUser.displayName,
              roleId: null,
            });
            setUserRole("user"); // Default role
          }
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
