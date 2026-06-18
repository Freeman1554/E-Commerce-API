const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model.js')
const { updateSchema } = require('../Schema/user.Validator.js')

const getAllUser = async (req, res, next) => {
    try {
        console.log("QUERY:", req.query)
        const {page = 1, limit = 10, search, role} = req.query
        const skip = (page - 1)*limit
        let query = {}
        if(search) {
            query = {...query, $or: [{name:{$regex: search, $options: 'i'}},
                {email:{$regex: search, $options: 'i'}}, {role:{$regex: search, $options: 'i'}},
            ]}
        }

        if (role) {
            query.role = new RegExp(`^${role.trim()}$`, 'i');
        }
        const [user, total] = await Promise.all([UserModel.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({createdAt: -1}),
            UserModel.countDocuments(query)
        ])
        return res.status(201).json({user, meta:{total, page:Number(page),
            limit: Number(limit)
        }})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const getUserById = async (req, res, next) => {
    try {
        const{id} = req.params;
    const user = await UserModel.findById(id) 
    if(!user)
        return res.status(404).json({message: "User does not exist"})
    return res.status(201).json({message:"User fetched", data: user})
    } catch (error) {
        next(error)
    }
}

const deleteUserById = async (req, res, next) => {
    try {
        const{id} = req.params;
        const delUser = await UserModel.findByIdAndDelete(id, {new:true})
       // const user = delUser.length;
        if(!delUser)
            return res.status(401).json({message: "Invalid ID"})
        return res.status(200).json({message: "User deleted successfully"})
    } catch (error) {
        next(error)
        
    }
}

const editUserById = async (req, res, next) => {
    try {
        const{error} = updateSchema.validate(req.body)
        if(error) return res.status(400).json({error:error.details[0].message})
        const{id} = req.params;
        if(req.body.password)  {
            req.body.password = await bcrypt.hash(req.body.password, 12)
        }
        const updateUser = await UserModel.findByIdAndUpdate(id, req.body, {new: true})
        if(!updateUser) throw new Error ("Invalid ID")
            return res.status(201).json({message: "Update Successful", data: updateUser})
    } catch (error) {
        next(error)
    }
}

const changeUserRoleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ["user", "seller", "admin"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const user = await UserModel.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Role updated successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {getAllUser,
    getUserById,
    editUserById,
    deleteUserById,
    changeUserRoleById
}