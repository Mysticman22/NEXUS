import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Custom Hook: useAuth
 * Purpose: Allows any component to easily access user data (user, role, employerType).
 * Usage: const { currentUser, employerType } = useAuth();
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  // "Pro" Safety Check:
  // This ensures you don't accidentally use the hook outside the <AuthProvider>
  // which would cause silent bugs (undefined context).
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;