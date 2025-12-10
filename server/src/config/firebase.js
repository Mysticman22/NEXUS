// File: client/src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth"; 
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // Added connectFirestoreEmulator
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"; // Added Functions imports

const firebaseConfig = {
    // Uses environment variables (VITE is a common convention for local React/Vite projects)
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize the main Firebase app instance
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);


// --- LOCAL EMULATOR SETUP (DEV ONLY) ---
// This block ensures the client connects to the local emulators when running on localhost.
if (window.location.hostname === "localhost") {
    console.log("Connecting to Firebase Emulators...");
    
    // 1. Auth Emulator (Default port 9099)
    connectAuthEmulator(auth, "http://localhost:9099"); 
    
    // 2. Firestore Emulator (Using your custom port 8088)
    connectFirestoreEmulator(db, 'localhost', 8088);
    
    // 3. Functions Emulator (Required for approveUser logic, default port 5001)
    const functions = getFunctions(app);
    connectFunctionsEmulator(functions, 'localhost', 5001); 
}