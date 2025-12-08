import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SignupForm = () => {
  // State for toggling between Detail Entry (1) and OTP Entry (2)
  const [step, setStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employerType: '',
    password: ''
  });
  
  // OTP State
  const [otp, setOtp] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear errors when user types
  };

  // STEP 1: Send Data to Node Backend to Generate OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connects to: server/src/routes/authRoutes.js -> requestSignupOtp
      await axios.post('http://localhost:5000/api/auth/request-otp', formData);
      setStep(2); // Move to OTP Screen
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Create Final Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connects to: server/src/routes/authRoutes.js -> verifyAndCreateUser
      await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: formData.email,
        otp: otp
      });
      
      alert('Account verified and created successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Nexus Access</h2>
          <p className="text-gray-500 text-sm mt-2">
            {step === 1 ? 'Create your enterprise account' : 'Verify your identity'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* --- STEP 1: REGISTRATION DETAILS --- */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@nexus.com"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 555-0199"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Employer Type</label>
              <select
                name="employerType"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white"
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>Select Department</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales Analysis">Sales Analysis</option>
                <option value="Director">Director (Admin Access)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Processing...' : 'Send Verification Code'}
            </button>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an ID? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
            </p>
          </form>
        )}

        {/* --- STEP 2: OTP VERIFICATION --- */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                We sent a 6-digit code to <span className="font-semibold">{formData.email}</span>
              </p>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength="6"
                className="block w-full text-center text-2xl tracking-[0.5em] p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupForm;