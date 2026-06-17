// Default Scripts to create a system admin to be used by the team (run node seedAdmin.js)
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./Models/user.model");
const connectDB = require("./Config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@shop.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created:", admin.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
