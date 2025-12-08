const express = require('express');
const cors = require('cors');
const authRoutes = require('routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite Client
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/', (req, res) => res.send('Nexus Search Engine API is Live'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});