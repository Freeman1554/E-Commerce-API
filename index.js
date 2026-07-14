const dotenv = require('dotenv').config();
const app = require('./src/app.js');
const connectDB = require('./src/Config/db.js');


const PORT = process.env.PORT || 2000;




app.listen(PORT, () => {
    connectDB(); // Ensure the database connection is established before starting the server
    console.log(`Server is running on Port http://localhost:${PORT}`);
});