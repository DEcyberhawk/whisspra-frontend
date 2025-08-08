
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
            Loading...
        </div>
    );
  }

  if (!user || user.role !== 'admin') {
    // Redirect them to the home page, but save the current location they were
    // trying to go to. This is a good user experience in case they log in as an admin later.
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;