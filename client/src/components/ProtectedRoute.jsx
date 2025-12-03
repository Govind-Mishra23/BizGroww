import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const ProtectedRoute = ({ allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const userInfoStr = localStorage.getItem("userInfo");

  useEffect(() => {
    const verifyToken = async () => {
      if (!userInfoStr) {
        setLoading(false);
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoStr);

        // Verify token is still valid by making a protected API call
        // This will fail if token is expired or invalid
        await axiosClient.get("/company");

        // Check if user role is allowed
        if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Token is invalid or expired, clear localStorage
        localStorage.removeItem("userInfo");
        localStorage.removeItem("businessModel");
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [userInfoStr, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!userInfoStr) {
    return <Navigate to="/login" replace />;
  }

  const userInfo = JSON.parse(userInfoStr);
  const userRole = userInfo.role;

  if (!isValid) {
    // Token is invalid or user doesn't have permission
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to the appropriate home page based on their actual role
    if (userRole === "manufacturer") {
      return <Navigate to="/manufacturer/profile" replace />;
    } else if (userRole === "distributor") {
      return <Navigate to="/distributor/home" replace />;
    } else if (userRole === "retailer") {
      return <Navigate to="/retailer/home" replace />;
    } else if (userRole === "candidate") {
      return <Navigate to="/candidate/home" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
