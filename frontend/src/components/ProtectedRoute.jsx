import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  // Wait until Clerk is loaded
  if (!isLoaded) return null;

  // If not signed in, redirect to custom sign-in page
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return <>{children}</>;
}
