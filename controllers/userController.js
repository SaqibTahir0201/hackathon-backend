// routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/users/signup
router.post("/signup", async (req, res) => {
  const { name, email, password, imageUrl } = req.body; // Get the imageUrl from the request body

  try {
    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the received data, including the imageUrl
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      imageUrl,  // Save the imageUrl in the database
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token (optional, if you want to authenticate after signup)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the user data (excluding password) and the JWT token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        imageUrl: newUser.imageUrl,
      },
      token,  // Send the JWT token to the frontend
    });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
