import React from "react";
import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../hooks/use-auth";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        data-testid="auth-loading"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/connections" replace />;
  }

  return <>{children}</>;
}
