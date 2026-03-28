const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load the secret variables from the .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

// Middleware: Allow our app to accept JSON data and requests from other ports
app.use(express.json());
app.use(cors());

// A simple test route to see if the server is alive
app.get('/', (req, res) => {
    res.send('Solid Waste Management API is running...');
});
// Mount the routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/requests', require('./routes/requestRoutes')); 

// Determine the port (use the one from .env, or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});