const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    confirmPassword: Joi.string().min(6).required()
})

const loginSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

const updateSchema = Joi.object({
    name: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    password: Joi.string().min(6),
})

module.exports = {registerSchema, loginSchema, updateSchema}