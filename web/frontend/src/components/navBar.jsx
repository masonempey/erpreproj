import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const navBar = () => {
  const { user, error, isLoading } = useUser();

  return (
    <div>
      {user ? (
        <div>
          <a href="/api/auth/logout">Logout</a>
        </div>
      ) : (
        <div>
          <a href="/api/auth/login">Login</a>
        </div>
      )}
    </div>
  );
};

export default navBar;
