import React, { useState } from 'react';
import { auth, db } from '../../config/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// Assume you are using useAuth to handle state updates
// import { useAuth } from '../../hooks/useAuth'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    // const { login } = useAuth(); // If using a global auth context

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg('Signing in...');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // --- VERIFICATION GATE 1: EMAIL OWNERSHIP CHECK ---
            if (!user.emailVerified) {
                setMsg("Login Failed: Please click the verification link sent to your email.");
                await auth.signOut(); // Force sign-out to prevent access
                return;
            }

            // --- VERIFICATION GATE 2: ADMIN APPROVAL CHECK ---
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                setMsg("Login Failed: User profile not found.");
                await auth.signOut();
                return;
            }

            const userData = userDoc.data();
            if (userData.status !== "ACTIVE") {
                setMsg("Login Failed: Account is still PENDING Admin approval.");
                await auth.signOut();
                return;
            }

            // If both checks pass, the user is successfully logged in.
            // login(user); // If using a global auth context
            setMsg("Login Successful! Redirecting...");
            // You would place your navigation logic here (e.g., navigate('/dashboard'))

        } catch (error) {
            setMsg("Login Error: " + error.message);
            console.error(error);
        }
    };

    return (
        <div className="p-10">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm">
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2" required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2" required />
                <button type="submit" className="bg-green-500 text-white p-2">Sign In</button>
            </form>
            {msg && <p className={`mt-4 ${msg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        </div>
    );
};

export default Login;