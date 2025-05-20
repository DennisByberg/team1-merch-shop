import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  adminRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminRequired = false }) => {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Verifying authentication...</Typography>
      </Box>
    );
  }

  if (adminRequired && !isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Om adminRequired är false, eller om användaren är admin, rendera den begärda komponenten.
  return <Outlet />;
};

export default ProtectedRoute;
