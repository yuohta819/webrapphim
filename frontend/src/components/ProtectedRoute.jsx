
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { authUser } = useAuth();
  const location = useLocation();

  if (!authUser) {
    // Redirect to login page and save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(authUser.role)) {
    // Redirect to home if user does not have permission
    return <Navigate to="/" replace />;
  }

  return children;
}
