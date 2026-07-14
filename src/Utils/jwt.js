const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const generateAccessToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };
    return jwt.sign(
                    payload,  //payload
                    process.env.JWT_SECRET, //secret
                    {expiresIn: '1h'} //options
                )

}

const generateRefreshToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };
    return jwt.sign(
                    payload,  //payload
                    process.env.JWT_SECRET, //secret
                    {expiresIn: '7d'} //options
                )

}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}