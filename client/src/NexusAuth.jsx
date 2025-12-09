import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './config/firebase';
import './NexusAuth.css';

const NexusAuth = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    department: '', // Default empty
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, username, department } = formData;

    try {
      // 1. Validation
      if (!department) throw new Error("Please select your department");
      if (!username) throw new Error("Username is required");

      // 2. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 3. Update Profile with Username
      await updateProfile(userCredential.user, {
        displayName: username
      });
      
      // 4. Store Department Locally (Simulating DB storage)
      localStorage.setItem('nexus_user_dept', department);
      localStorage.setItem('nexus_user_name', username);

      // 5. Success Callback
      if (onLoginSuccess) onLoginSuccess(userCredential.user);

    } catch (err) {
      console.error(err);
      const msg = err.message.replace('Firebase: ', '').replace('auth/', '');
      setError(msg.charAt(0).toUpperCase() + msg.slice(1));
    }
    setLoading(false);
  };

  return (
    <div className="nexus-container">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>

      <div className="glass-card">
        <div className="card-header">
          <h1>Nexus Access</h1>
          <p className="subtitle">Enterprise Gateway Login</p>
        </div>

        <form onSubmit={handleRegister}>
          <AnimatePresence>
            
            {/* === 1. USERNAME === */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="input-group"
            >
              <User size={20} />
              <input 
                type="text" 
                name="username"
                placeholder="Full Name" 
                value={formData.username}
                onChange={handleChange}
                required
              />
            </motion.div>

            {/* === 2. DEPARTMENT === */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="input-group"
            >
              <Building size={20} />
              <select 
                name="department"
                className="custom-select"
                value={formData.department}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
                <option value="legal">Legal</option>
                <option value="operations">Operations</option>
              </select>
            </motion.div>

            {/* === 3. EMAIL === */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="input-group"
            >
              <Mail size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="Enterprise Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </motion.div>

            {/* === 4. PASSWORD === */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="input-group"
            >
              <Lock size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </motion.div>

          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Submit Button */}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spinner" /> : (
              <>
                Access Nexus 
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NexusAuth;