const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  createAdmin,
} = require("../Controllers/auth.controller");

const requireAuth = require("../Middleware/requireAuth");
const authorize = require("../Middleware/authorize");

const router = express.Router();

// CUSTOMER REGISTRATION (PUBLIC)
router.post("/register", registerUser);

// LOGIN (PUBLIC)
router.post("/login", loginUser);

// CURRENT USER (PROTECTED)
router.get("/me", requireAuth, getCurrentUser);

// ADMIN CREATION (PROTECTED + ADMIN ONLY)
router.post("/create-admin", requireAuth, authorize("admin"), createAdmin);

module.exports = router;
