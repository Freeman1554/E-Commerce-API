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
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    loginAttempts: {
        type: Number,
        default: 0
    }
}, {timestamps: true} );

userSchema.index( { unique: true }, {loginAttempts: 1}); // Ensure unique index on email field
//userSchema.index({ loginAttempts: 1 }); // Ensure index on loginAttempts field


const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;