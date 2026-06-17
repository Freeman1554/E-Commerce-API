const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../Controllers/auth.controller");

const requireAuth = require("../Middleware/requireAuth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
