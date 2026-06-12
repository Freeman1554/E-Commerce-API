const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db.js');
const logRequest = require('./Middleware/loggers.js');
const errorhandlers = require('./Middleware/errorHandler.js');
const productRoutes = require('./routes/product.route.js');
const userRoutes = require('./routes/user.route.js') 



dotenv.config();
const app = express()
connectDB()


app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"]
}))

app.use(logRequest)




const PORT = process.env.PORT || 2000

app.use('/api', productRoutes)
app.use('/api', userRoutes)


app.use(errorhandlers)

app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`)
})