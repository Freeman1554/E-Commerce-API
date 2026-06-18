# E-COMMERCE API
An E-commerce API (Application Programming Interface) is a set of rules and protocols that enables different software applications to communicate and exchange data within an e-commerce ecosystem. It acts as the bridge between the client-side application (web or mobile) and the database, allowing secure and efficient management of product information.

In this project, we are building an E-commerce API that manages products with the following attributes:

Name – The product name.
Price – The cost of the product.
Description – Detailed information about the product.
Category – The classification of the product.
InStock – Indicates product availability.

Additionally, the system includes user authentication and authorization, ensuring that only authorized users can access or modify specific resources.

## Problems the API Seeks to Solve
1. Product Information Management

Managing product information manually can be inefficient and error-prone. The API provides a centralized platform for creating, retrieving, updating, and deleting product data.

2. Data Validation and Integrity

Invalid product details such as missing names, negative prices, or incorrect categories can affect business operations. The API validates incoming data to ensure accuracy and consistency.

3. Inventory Management

Customers should not be able to purchase products that are unavailable. The API tracks stock availability through the InStock field, helping businesses manage inventory effectively.

4. Secure Access to Resources

One of the major challenges in e-commerce systems is preventing unauthorized access to sensitive operations. Without proper security measures, anyone could create, modify, or delete products.

## To solve this problem, the API implements:

Authentication using JSON Web Tokens (JWT).
Protected Routes that require a valid token before access is granted.
Authorization to restrict certain operations to administrators only.

For example:

Regular users can view products.
Administrators can create, update, and delete products.
User-management endpoints are accessible only to administrators.

This ensures that sensitive business operations are protected from unauthorized users.

5. User Management and Role Control

The system supports different user roles, such as User and Admin. This helps enforce access control policies and ensures that users can only perform actions permitted by their role.

6. Efficient Product Search and Retrieval

As the number of products grows, finding specific products becomes more difficult. The API provides search, filtering, and pagination capabilities to improve performance and user experience.

7. Scalability and Integration

Modern e-commerce systems often need to integrate with mobile applications, payment systems, analytics tools, and third-party services. The API provides a scalable architecture that supports future growth and integrations.

## Expected Outcome
The final E-commerce API will provide a secure, scalable, and efficient platform for managing products and users. Through authentication, protected routes, and role-based access control, the system ensures that sensitive operations are restricted to authorized users while maintaining data integrity, inventory accuracy, and a seamless user experience.

## Methodology
- Create two models which includes; Users(name, email, password) and Products(userId, Price, Descritpion, Category, inStock, timeStamp)
- Write a logic controllers for Users and Product which will include(registerUser, loginUser, Update and deleteUser), and Products(postProduct, getProduct, patchProduct and deleteProduct)
- Note a user access right to get listed products and make purchases while an Admin access right to postProduct, deleteProduct and updateProduct.

## Technology
- Runtime: Node.js + Express
- Database: MongoDB Atlas
- Config: Dotenv

## ARCHITECTURAL DIAGRAM
![alt text](image.png)

## Features Implemented
- Error handling
- Middleware
- CORS
- Validator - joi
- Logs
- Filtering
- Pagination
- Product Search
- Backend - Express, Nodejs
- bcrypt: for password hashing
- JWT: Token generation. Refresh Tokens
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

## ENDPOINTS COLLECTION
http://localhost:2026/api/auth/sign-up METHOD: POST
http://localhost:2026/api/auth/login METHOD: POST
http://localhost:2026/api/user/search METHOD: GET
http://localhost:2026/api/user/:id  METHOD: GET
http://localhost:2026/api/user/:id METHOD: PATCH
http://localhost:2026/api/user/:id METHOD: DELETE
http://localhost:2026/api/products METHOD: POST
http://localhost:2026/api/products METHOD: GET
http://localhost:2026/api/products/:id METHOD: PUT
http://localhost:2026/api/products/:id METHOD: DELETE