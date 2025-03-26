import React from "react";
import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

interface AuthorizeViewProps {
  children: React.ReactNode;
}

export default function AuthorizeView({ children }: AuthorizeViewProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/LoginPage" replace />;
  }

  return <>{children}</>;
}
