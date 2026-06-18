const {registerSchema, loginSchema} = require('../Schema/user.Validator');
const UserModel = require('../Models/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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
            const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) throw new Error("Invalid Credential")

            const token = jwt.sign(
                    { userId: user._id, name: user.name, role: user.role}, //payload
                    process.env.JWT_SECRET, //secret
                    {expiresIn: '7d'} //options
                )

                const resUser = {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    _id: user._id
                }

                return res.status(200).json({message: "User logged in successfully", 
                    user: resUser, token})
    } catch (error) {
        next(error)
    }
}

module.exports = {registerUser, loginUser}