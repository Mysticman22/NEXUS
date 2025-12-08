import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupForm = () => {
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    employerType: ''
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Backend URL - Change if deployed
  const API_URL = 'http://localhost:5000/api/auth';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send Data to Node Backend to trigger OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/request-signup-otp`, formData);
      setStep(2); // Move to OTP screen
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Create User
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/verify-signup-otp`, {
        email: formData.email,
        otp
      });
      alert('Account Created Successfully!');
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Nexus Access</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <select
              name="employerType"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-white"
              required
            >
              <option value="">Select Role</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales Analysis">Sales Analysis</option>
              <option value="Director">Director (Admin)</option>
            </select>
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required