const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db.js');
const logRequest = require('./Middleware/loggers.js');
const errorHandlers = require('./Middleware/errorHandler.js');
const productRoutes = require('./routes/product.route.js'); 
const userRoutes = require('./routes/user.route.js')

const app = express();
connectDB();

app.use(express.json());  
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





app.use(errorHandlers);

app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`);
});