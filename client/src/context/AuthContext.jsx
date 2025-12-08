import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// 1. Create the Context
const AuthContext = createContext({
  currentUser: null,
  userRole: null,       // 'admin' or 'staff'
  employerType: null,   // 'HR', 'Finance', 'Director', etc.
  loading: true,
});

// 2. Custom Hook for easy usage in components
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [employerType, setEmployerType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes (Login, Logout, Refresh)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Force refresh the token to ensure we get the latest claims from the Backend
          // (Important if the admin just promoted this user)
          const tokenResult = await user.getIdTokenResult(true);
          
          setCurrentUser(user);
          setUserRole(tokenResult.claims.role || 'staff'); 
          setEmployerType(tokenResult.claims.employerType || 'Employee');
          
        } catch (error) {
          console.error("Error fetching user claims:", error);
          // Fallback if claims fail to load
          setCurrentUser(user);
          setUserRole('staff');
          setEmployerType('Employee');
        }
      } else {
        // User logged out
        setCurrentUser(null);
        setUserRole(null);
        setEmployerType(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // The value object contains everything the app needs to know about the user
  const value = {
    currentUser,
    userRole,
    employerType,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;