import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserType: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserType 
}) => {
  const { isAuthenticated, userType } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Convert userType array to lowercase for case-insensitive comparison
  const userTypesLowerCase = userType ? userType.map(type => type.toLowerCase()) : [];
  const targetTypeLowerCase = allowedUserType.toLowerCase();

  // Check if user has the required role
  const hasRequiredRole = userTypesLowerCase.includes(targetTypeLowerCase);

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on user roles (highest privilege first)
    if (userTypesLowerCase.includes('nsft')) {
      return <Navigate to="/nsft/dashboard" replace />;
    } else if (userTypesLowerCase.includes('bp')) {
      return <Navigate to="/bp/dashboard" replace />;
    } else if (userTypesLowerCase.includes('cr')) {
      return <Navigate to="/cr/dashboard" replace />;
    } else if (userTypesLowerCase.includes('student') || userTypesLowerCase.includes('personal')) {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 