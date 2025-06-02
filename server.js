const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userDataRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const retirementPlanRoutes = require('./routes/retirementPlanRoutes');
const retirementRoutes = require('./routes/retirementSimulation');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const basePath = process.env.BASE_PATH || '';
// Routes
app.use(`${basePath}/api/auth`, authRoutes);
app.use(`${basePath}/api/user`, userRoutes);
app.use(`${basePath}/api/user`, investmentRoutes); 
app.use(`${basePath}/api/user`, retirementPlanRoutes);
app.use(`${basePath}/api/user`, retirementRoutes); 



// Connect to MongoDB
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});