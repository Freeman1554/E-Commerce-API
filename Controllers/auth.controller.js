const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../Models/user.model");

const registerUser = async (req, res, next) => {
  try {
    const registerSchema = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

const createAdmin = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", // FORCE ADMIN ROLE
    });

    return res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  createAdmin,
};
