const admin = require("firebase-admin");

// This imports the key you just downloaded and saved
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;