import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SigninForm from './components/auth/SigninForm';
import SignupForm from './components/auth/SignupForm';
import AdminDash from './components/dashboard/AdminDash';
import UserDash from './components/dashboard/UserDash';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Component to handle default redirects based on role
import useAuth from './hooks/useAuth';

const RoleBasedRedirect = () => {
  const { userRole } = useAuth();
  if (userRole === 'admin') return <Navigate to="/admin" />;
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<SigninForm />} />
        <Route path="/signup" element={<SignupForm />} />
        
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* --- Protected Routes --- */}
        
        {/* 1. General User Dashboard (Accessible by All Logged In Users) */}
        <Route element={<ProtectedRoute />}>
           <Route path="/dashboard" element={<UserDash />} />
        </Route>

        {/* 2. Admin Dashboard (Accessible ONLY by Directors/Admins) */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'Director']} />}>
           <Route path="/admin" element={<AdminDash />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;