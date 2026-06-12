# E-Commerce API
An E-commerce API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate and exchange data within an e-commerce ecosystem.
in this project, we are building an E-commerce with the following functionalities such as Name, Price, Description, Category and inStock.

## Methodology
- Create two models which includes; Users(name, email, password) and Products(userId, Price, Descritpion, Category, inStock, timeStamp)
- Write a logic controllers for Users and Product which will include(registerUser, loginUser, Update and deleteUser), and Products(postProduct, getProduct, patchProduct and deleteProduct)
- Note a user access right to get listed products and make purchases while an Admin access right to postProduct, deleteProduct and updateProduct.

## Technology
- Runtime: Node.js + Express
- Database: MongoDB Atlas
- Config: Dotenv

## Requirements
- Error handling
- Middleware
- CORS
- Validator - joi
- Logs
- Backend - Express, Nodejs
- bcrypt: for password hashing
- JWT: For token generation and authorization
- multer: for document upload

## Requirements to be included

- Email service: nodemailer
- Logging: FS or Pino 
- External API: axios or fetch
- Frontend and Backend Connection: react-native
-  Caching: redis
- Websockets: socket.io node http
- Testing: jest
- Database - sequelize and mysql2

