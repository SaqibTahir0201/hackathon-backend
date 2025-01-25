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

// Export functions instead of router
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Add validation for required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user
    const savedUser = await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
      token,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      error: "Server error", 
      details: error.message
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  signUp,
  login
};
