require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2; // Import Cloudinary
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");

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

// Cloudinary image upload route
app.post("/api/upload", (req, res) => {
  const file = req.body.image; // Assuming image is in the request body
  
  cloudinary.uploader
    .upload(file, { folder: "users/images" }) // You can specify a folder if needed
    .then((result) => {
      res.json({ message: "Image uploaded successfully", url: result.secure_url });
    })
    .catch((error) => {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "Failed to upload image" });
    });
});

// Routes
app.use("/api/users", userRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
