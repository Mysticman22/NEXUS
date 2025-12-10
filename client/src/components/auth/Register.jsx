import React, { useState } from 'react';
import { auth, db } from '../../config/firebase'; 
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// import axios from 'axios'; <-- Removed: axios is not used in this file

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('Registering...');
    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Send Verification Email (Initiates the mail verification process)
      // This is necessary to confirm the user owns the email address.
      await sendEmailVerification(user);

      // 3. SAVE PENDING STATUS TO FIRESTORE (The Admin Approval requirement)
      // The user is created but remains locked until approved by the admin AND email is verified.
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        status: "PENDING", // <-- Account is created but locked until admin approval
        role: "USER",
        registeredAt: new Date()
      });
      
      setMsg("Success! Account created. Check your email for verification link. Account is PENDING Admin approval.");

    } catch (error) {
      // Handles common errors like "auth/email-already-in-use" or "auth/invalid-email"
      setMsg("Registration Error: " + error.message);
      console.error(error);
    }
  };

  return (
    <div className="p-10">
      <h2>Register Account</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-sm">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2" required />
        <input type="password" placeholder="Password (min 6 chars)" onChange={(e) => setPassword(e.target.value)} className="border p-2" required />
        <button type="submit" className="bg-blue-500 text-white p-2">Sign Up</button>
      </form>
      {msg && <p className={`mt-4 ${msg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
    </div>
  );
};

export default Register;