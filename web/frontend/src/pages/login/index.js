"use client";

import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const auth = getAuth();

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res);
      setEmail("");
      setPassword("");
      setError(""); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* <-- Display error if any */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Login;
