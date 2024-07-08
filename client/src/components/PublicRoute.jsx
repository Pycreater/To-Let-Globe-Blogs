// Import necessary libraries and types
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

// Define the PublicRoute component which takes in children as its prop
const PublicRoute = ({ children }) => {
  // Destructure token and user from the authentication context
  const { token, user } = useAuth();

  // If there is a valid token and user ID, navigate the user to the chat page
  if (token && user) return <Navigate to="/" replace />;

  // If no token or user ID exists, render the child components as they are
  return children;
};

// Export the PublicRoute component for use in other parts of the application
export default PublicRoute;
