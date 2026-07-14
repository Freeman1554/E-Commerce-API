const dotenv = require('dotenv').config();

const express = require('express');
const cors = require('cors');
//const connectDB = require('../src/Config/db.js');
const logRequest = require('../src/Middleware/loggers.js');
const errorHandlers = require('../src/Middleware/errorHandler.js');
const productRoutes = require('../src/routes/product.route.js'); 
const userRoutes = require('../src/routes/user.route.js')
const cookieParser = require('cookie-parser');

const app = express();
//connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Added PUT for product updates
    allowedHeaders: ["Content-Type"]
}));

app.use(logRequest);

const PORT = process.env.PORT || 2000;

// Mount your routes perfectly to match your paths
app.use('/api/products', productRoutes); // This handles all your endpoints under http://localhost:2000/api/products
app.use('/api', userRoutes);  


// console.log('PORT:', process.env.PORT);
// console.log('MONGODB_URI:', process.env.MONGODB_URL);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
// console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);

app.use(errorHandlers);

module.exports = app; // Export the app for testing or further use