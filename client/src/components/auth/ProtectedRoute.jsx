import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

/**
 * ProtectedRoute Component
 * * @param {Array} allowedRoles - (Optional) List of roles/employerTypes allowed to access this route.
 * e.g., ['admin', 'HR', 'Director']
 * If left empty, it only checks if the user is logged in.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    
    // Subscribe to Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // User is not logged in
        setUser(null);
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // If no specific roles are required, just being logged in is enough
      if (allowedRoles.length === 0) {
        setIsAuthorized(true);
        setLoading(false);
        return;
      }

      try {
        // Force token refresh to get the latest Custom Claims (security best practice)
        const tokenResult = await currentUser.getIdTokenResult(true);
        const { role, employerType } = tokenResult.claims;

        // Check if the user's "role" OR "employerType" matches any of the allowed roles
        // Example: allowedRoles=['admin'] matches if claims.role === 'admin'
        // Example: allowedRoles=['HR'] matches if claims.employerType === 'HR'
        const hasPermission = allowedRoles.includes(role) || allowedRoles.includes(employerType);

        setIsAuthorized(hasPermission);
      } catch (error) {
        console.error("Error verifying user claims:", error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [allowedRoles]);

  if (loading) {
    // You can replace this with a proper Spinner component
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        Loading permissions...
      </div>
    );
  }

  if (!user) {
    // Redirect to Login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    // Redirect to User Dashboard (or a generic 'Unauthorized' page) if logged in but wrong role
    // This prevents 'Director' pages from being accessed by 'Sales Analysis' staff
    return <Navigate to="/dashboard" replace />;
  }

  // Render the child routes (The actual protected page)
  return <Outlet />;
};

export default ProtectedRoute;