require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2; // Import Cloudinary
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api", uploadRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
