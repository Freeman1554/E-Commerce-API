const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db.js");
const logRequest = require("./Middleware/loggers.js");
const errorhandlers = require("./Middleware/errorHandler.js");
const productRoutes = require("./routes/product.route.js");
const AuthRoutes = require("./routes/auth.route.js");
// const userRoutes = require('./routes/user.route.js');    // Commented out until Member 2 finishes

const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Added PUT for product updates
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(logRequest);

const PORT = process.env.PORT || 2000;

app.use("/api/auth", AuthRoutes);
// Mount your routes perfectly to match your paths
app.use("/api/products", productRoutes); // This handles all your endpoints under http://localhost:2000/api/products
// app.use('/api', userRoutes);            // Commented out until Member 2 fixes their handlers

app.use(errorhandlers);

app.listen(PORT, () => {
  console.log(`Server is running on Port http://localhost:${PORT}`);
});
