const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// SIMPLE STORAGE (In a real app, use a Database like MongoDB)
let lastGeneratedCode = null; 

// 1. GENERATE CODE ROUTE
app.post('/api/auth', (req, res) => {
    const { email } = req.body;
    // Generate Code
    const fakeCode = Math.floor(100000 + Math.random() * 900000);
    lastGeneratedCode = fakeCode.toString(); // Save it!

    console.log("------------------------------------------------");
    console.log(`Email: ${email}`);
    console.log(`CODE:  ${fakeCode}`);
    console.log("------------------------------------------------");

    res.json({ message: "Code sent" });
});

// 2. NEW: VERIFY CODE ROUTE
app.post('/api/verify', (req, res) => {
    const { code } = req.body;

    if (code === lastGeneratedCode) {
        res.json({ success: true, message: "Welcome to Nexus!" });
    } else {
        res.status(400).json({ success: false, message: "Invalid Code" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});