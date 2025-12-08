const admin = require('../config/firebase-admin');
const db = admin.firestore();
const nodemailer = require('nodemailer');

// 1. REQUEST OTP (Step 1 of Signup)
exports.requestSignupOtp = async (req, res) => {
  const { name, email, phone, employerType, password } = req.body;

  // Check if user already exists in Firebase to fail early
  try {
    await admin.auth().getUserByEmail(email);
    return res.status(400).json({ error: 'User already exists' });
  } catch (e) {
    // User doesn't exist, proceed
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store detailed registration data in a TEMP collection (expires in 10m)
  // In a real high-scale app, use Redis here. For now, Firestore is fine.
  await db.collection('pending_registrations').doc(email).set({
    name, phone, employerType, password, otp,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Send Email (Mocking the transport for brevity)
  // await emailService.sendOtp(email, otp); 
  console.log(`[DEV ONLY] OTP for ${email} is: ${otp}`);

  res.json({ message: 'OTP sent to email. Please verify.' });
};

// 2. VERIFY OTP & CREATE ACCOUNT (Step 2 of Signup)
exports.verifyAndCreateUser = async (req, res) => {
  const { email, otp } = req.body;
  
  const docRef = db.collection('pending_registrations').doc(email);
  const doc = await docRef.get();

  if (!doc.exists || doc.data().otp !== otp) {
    return res.status(400).json({ error: 'Invalid or Expired OTP' });
  }

  const userData = doc.data();

  try {
    // A. Create the User in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: userData.email,
      password: userData.password, // Raw password from temp storage
      displayName: userData.name,
      emailVerified: true // We just verified it!
    });

    // B. Set "Custom Claims" for Role-Based Access (The "Pro" way)
    // This embeds the role into the user's Auth Token securely.
    const customClaims = {
      employerType: userData.employerType,
      role: userData.employerType === 'Director' ? 'admin' : 'staff'
    };
    await admin.auth().setCustomUserClaims(userRecord.uid, customClaims);

    // C. Create a permanent user profile document (excluding password)
    await db.collection('users').doc(userRecord.uid).set({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      employerType: userData.employerType,
      role: customClaims.role,
      joinedAt: new Date()
    });

    // Cleanup temp data
    await docRef.delete();

    res.json({ message: 'Account created successfully! Please login.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};