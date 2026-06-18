const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user.model');

const requireAuth = async(req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        // console.log("AUTH HEADER:", authHeader);

    if(!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({error: "Access denied, no token"});
    
    const token = authHeader.replace('Bearer ', '');
    // console.log("TOKEN:", token)
    // console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("DECODED:", decoded)
    
    //Ensure user still exist even if token is valid
    const user = await UserModel.findById(decoded.userId)

    if(!user)
        return res.status(404).json({message: "User not found"})

    req.user = {
        userId: decoded.userId,
        name: decoded.name,
        role: decoded.role
    }
    
    // req.user = decoded // now every route knows who logged in
    next();
    } catch (error) {
        // console.log("JWT ERROR:", error.message)
       return res.status(401).json({error: "Invalid or expired token",
        details:error.message
       })
    } 
}

module.exports = requireAuth;