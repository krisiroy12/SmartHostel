const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await Admin.findOne({
      email: "admin@SmartHostel.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists ✅");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    const admin = new Admin({
      name: "SmartHostel Admin",
      email: "admin@SmartHostel.com",
      password: hashedPassword,
    });

    await admin.save();

    console.log("Admin created successfully ✅");
    console.log("Email: admin@SmartHostel.com");
    console.log("Password: Admin@123");

    process.exit();
  } catch (error) {
    console.error("Admin creation error ❌");
    console.error(error.message);
    process.exit(1);
  }
}

createAdmin();