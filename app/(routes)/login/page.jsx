"use client";

//Login page was based around Mason's other project.

import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { styled } from "@mui/system";
import styles from "../../styles/login.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const FormContainer = styled(Paper)({
  padding: "2rem",
  maxWidth: "400px",
  width: "100%",
  backgroundColor: "#fafafa",
});

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, phoneNumber}),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please log in.");
      setEmail("");
      setPassword("");
      setPhoneNumber("");

    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      const validateRes = await fetch("/api/users/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid: userCredential.user.uid }),
      });

      if (!validateRes.ok) {
        const data = await validateRes.json();
        throw new Error(data.message || "User validation failed");
      }

      router.push("/home");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.message?.includes("auth/")
          ? "Invalid email or password"
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/users/googleregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: result.user.email,
          uid: result.user.uid,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }
      router.replace("/home");
      window.location.reload(); 
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(
        error.message.includes("auth/")
          ? "Authentication failed. Please try again."
          : error.message || "Failed to sign in with Google."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <FormContainer elevation={3}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
            color: "#35281f",
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#35281f",
              },
              "&:hover fieldset": {
                borderColor: "#35281f",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#35281f",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#35281f",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#35281f",
            },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#35281f",
              },
              "&:hover fieldset": {
                borderColor: "#35281f",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#35281f",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#35281f",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#35281f",
            },
          }}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          type="Phone Number"
          fullWidth
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#35281f",
              },
              "&:hover fieldset": {
                borderColor: "#35281f",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#35281f",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#35281f",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#35281f",
            },
          }}
          style={{ display: isLogin ? "none" : "block" }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={isLogin ? handleLogin : handleSignUp}
          sx={{
            mt: 2,
            backgroundColor: "#35281f",
            color: "#fafafa",
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => setIsLogin(!isLogin)}
          sx={{
            mt: 2,
            borderColor: "#35281f",
            color: "#35281f",
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
          }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleGoogleSignIn}
          sx={{
            mt: 2,
            backgroundColor: "#fafafa",
            color: "#35281f",
            border: "1px solid #35281f",
            fontFamily: "Lato",
            fontWeight: 800,
            fontStyle: "normal",
          }}
        >
          Sign in with Google
        </Button>
      </FormContainer>
    </div>
  );
};

export default Login;
