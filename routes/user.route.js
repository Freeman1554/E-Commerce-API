const express = require('express');
const validateUserPost = require('../Middleware/validateUserPost.js')
const{registerSchema, loginSchema} = require('../Schema/user.Validator.js')
const {registerUser, loginUser} = require('../Controllers/user.controller')
const {getAllUser, getUserById, 
    deleteUserById, editUserById, 
    changeUserRoleById} = require('../Controllers/admin.Controller')
const requireAuth = require('../Middleware/requireAuth')
const requireAdmin = require('../Middleware/requireAdmin')

const router = express.Router();


router.post('/auth/sign-up', validateUserPost(registerSchema), registerUser, )

router.post('/auth/login', validateUserPost(loginSchema), loginUser)

router.use(requireAuth)
// router.use(requireAdmin)


router.get('/user/search', requireAdmin, getAllUser)

router.get('/user/:id', requireAdmin, getUserById)

router.patch('/user/:id', editUserById)

router.patch('/user/:id', requireAdmin,
     changeUserRoleById)

router.delete('/user/:id', requireAdmin, deleteUserById)

module.exports = router