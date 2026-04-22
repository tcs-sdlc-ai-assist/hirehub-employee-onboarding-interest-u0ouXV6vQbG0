import React from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminDashboard } from './AdminDashboard';
import { AdminLogin } from './AdminLogin';

export function ProtectedRoute() {
  const { isAuthenticated } = useAdminAuth();

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return <AdminLogin />;
}

export default ProtectedRoute;