const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
        
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true} );

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;