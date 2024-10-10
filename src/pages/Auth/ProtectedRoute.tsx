import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '../../hooks/AuthHooks';

const ProtectedRoute = () => {
  const isLoggedIn  = useIsAuthenticated();

  if (!isLoggedIn) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;