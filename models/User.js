const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String }, // Add this line to store image URL
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
