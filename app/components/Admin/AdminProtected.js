"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";

export default function AdminProtected({ children }) {
  const { user, userRole, loading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if not logged in
        router.push("/login?returnUrl=/admin");
      } else if (userRole !== "admin") {
        console.log("Access denied: User is not an admin");
        router.push("/");
      } else {
        console.log("User is authorized");
        setIsAuthorized(true);
      }
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
      </div>
    );
  }

  // Only render children if user is authorized
  return isAuthorized ? children : null;
}
