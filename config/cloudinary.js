// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'your-cloud-name', // Replace with your Cloudinary cloud name
  api_key: 'your-api-key', // Replace with your API key
  api_secret: 'your-api-secret', // Replace with your API secret
});

module.exports = cloudinary;
