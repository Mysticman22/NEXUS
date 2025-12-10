import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { auth, db } from './config/firebase';
import './NexusAuth.css';

const NexusAuth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(false); // Toggle: False = Register, True = Login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    department: '', 
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, username, department } = formData;

    try {
      // 1. Validation for BOTH Login and Register
      // Note: We'll skip department validation here as it's handled by the required prop on the select element.
      // If you MUST have this validation: if (!department) throw new Error("Please select your department");

      if (isLogin) {
        // ==========================
        // LOGIN LOGIC
        // ==========================
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // CHECK 4: Email Verification
        if (!user.emailVerified) {
          await signOut(auth); // Log them out immediately
          
          // Ask if they want a new link
          const resend = window.confirm("Your email is not verified yet. Click OK to resend the verification link.");
          if (resend) {
              await sendEmailVerification(user);
              alert(`Verification link sent again to ${email}`);
          }
          throw new Error("Email not verified. Please check your inbox.");
        }

        // If verified, proceed
        if (onLoginSuccess) onLoginSuccess(user);

      } else {
        // ==========================
        // REGISTER LOGIC
        // ==========================
        if (!username) throw new Error("Username is required");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username,
          email: email,
          department: department,
          role: "employee",
          createdAt: new Date().toISOString()
        });

        await sendEmailVerification(user);
        
        alert(`Account created! A verification link has been sent to ${email}. Please verify before logging in.`);
        
        // Switch to login view so they can sign in after verifying
        setIsLogin(true);
      }

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
          <p className="subtitle">
            {isLogin ? "Secure Enterprise Gateway" : "Create Enterprise Account"}
          </p>
        </div>

        <form onSubmit={handleAuth}>
          <AnimatePresence mode="wait"> 
            
            {/* FIX: The two conditional blocks below must have unique keys 
              when conditionally rendered as siblings within AnimatePresence.
            */}
            
            {/* USERNAME (Only for Register) */}
            {!isLogin && (
              <motion.div 
                key="register-fields" // <--- UNIQUE KEY ADDED/FIXED
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="input-group"
              >
                <User size={20} />
                <input 
                  type="text" name="username" placeholder="Full Name" 
                  value={formData.username} onChange={handleChange} required={!isLogin} 
                />
              </motion.div>
            )}
            
            {/* DEPARTMENT (Visible for BOTH Login and Register) */}
            {/* The Department field is always present, but it contains an AnimatePresence block that 
                doesn't depend on isLogin, so it's not the cause. The issue is with the conditional fields.
                However, for a cleaner and safer AnimatePresence setup, it's better to wrap 
                all conditional elements and only keep the static ones (like the email/password fields) 
                outside the AnimatePresence if they shouldn't animate.
                
                Since you only want to animate the username field's appearance/disappearance, 
                you only need to worry about the key for that field. 
                
                The following department field is currently not conditional, so it doesn't need a key
                inside AnimatePresence. But since it is inside, giving it a key ensures stability.
                
                Wait, let's re-read the original structure. Only the username field is conditional, and all 
                other fields are static. The key error came from the *absence* of a key on the conditional 
                `motion.div`. The fix is above.
            */}
            
            {/* The original code had the static fields inside AnimatePresence without keys. 
                We must move the static fields outside, or provide keys for ALL children of AnimatePresence. 
                The most efficient fix is to only put the conditional rendering inside AnimatePresence.
            */}

          </AnimatePresence>

          {/* DEPARTMENT (STATIC) - Moved outside AnimatePresence to simplify animation scope. */}
          <div className="input-group">
            <Building size={20} />
            <select 
              name="department" className="custom-select" 
              value={formData.department} onChange={handleChange} required
              style={{width: '100%', padding: '14px 14px 14px 48px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'white', appearance: 'none', outline: 'none', cursor: 'pointer'}}
            >
              <option value="" disabled>Select Department</option>
              <option value="engineering">Engineering</option>
              <option value="finance">Finance</option>
              <option value="hr">Human Resources</option>
              <option value="legal">Legal</option>
              <option value="operations">Operations</option>
            </select>
          </div>

          {/* EMAIL (STATIC) */}
          <div className="input-group">
            <Mail size={20} />
            <input 
              type="email" name="email" placeholder="Enterprise Email" 
              value={formData.email} onChange={handleChange} required 
            />
          </div>

          {/* PASSWORD (STATIC) */}
          <div className="input-group">
            <Lock size={20} />
            <input 
              type="password" name="password" placeholder="Password" 
              value={formData.password} onChange={handleChange} required 
            />
          </div>

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
                {isLogin ? "Sign In" : "Register & Verify"} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="card-footer">
          <p>
            {isLogin ? "New Employee? " : "Already verified? "}
            <span onClick={() => setIsLogin(!isLogin)} className="link-text">
              {isLogin ? "Register here" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NexusAuth;