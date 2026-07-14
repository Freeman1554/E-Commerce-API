const {registerSchema, loginSchema} = require('../Schema/user.Validator');
const UserModel = require('../Models/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../Utils/jwt.js')


const registerUser = async (req, res, next) => {
    try {
        const{error} = registerSchema.validate(req.body)
        if(error)
            return res.status(400).json({error: error.details[0].message})
        const{name, email, password, confirmPassword} = req.body
        const existUser = await UserModel.findOne({email})
        if(existUser)
            return res.status(404).json("User already exist")
        console.log(req.body);
        console.log(password);
        console.log(confirmPassword);
        if(password !== confirmPassword)
            return res.status(404).json({message: "Password does not match"})

        const hashed = await bcrypt.hash(password, 12)
        
        const User = await UserModel.create({
            name: name,
            email: email,
            password: hashed
        }) 
        return res.status(200).json({message: "User registed successfully", User})
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const{error} = loginSchema.validate(req.body)
        if(error) return res.status(400).json({error: error.details[0].message})

            const{email, password} = req.body

            const user = await UserModel.findOne({email: email})
        if(!user) return res.status(404).json({message: "User does not exist"})
        
        
        if(user.isBlocked) return res.status(403).json({
            message: "User is blocked, please contact admin"})
        
        if(user.loginAttempts >= 5) {
            user.isBlocked = true
            user.loginAttempts = 0
            await user.save()
            return res.status(403).json({
                message: "User is blocked due to multiple failed login attempts, please contact admin"
            })
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            user.loginAttempts += 1
            await user.save()
            return res.status(400).json({message: "Invalid credentials",
                loginAttempts: user.loginAttempts
            })
        }

            
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //save refresh token in user model
    user.refreshToken = refreshToken;
    user.loginAttempts = 0; // Reset login attempts on successful login
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({
        user, accessToken, message: "Login successful"
    })

    } catch (error) {
        next(error)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken  = req.cookies.refreshToken;

        console.log("Received refresh token:", refreshToken);

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const user = await UserModel.findOne({ refreshToken});
        if (!user) {
            return res.status(401).json({ message: "Invalid"})
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (decoded.id !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    //Update the refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({
        accessToken: newAccessToken,
        message: "Token refreshed successfully"
    });

    } catch (error) {
        next(error)
    }
}
module.exports = {registerUser, loginUser, refreshToken}