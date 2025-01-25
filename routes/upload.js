// routes/upload.js
const express = require('express');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const router = express.Router();

// Multer setup for file storage (not actually saving locally, just handling the file)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // auto-detect the resource type (image/video)
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error uploading image', error });
        }

        // Return the image URL after successful upload
        res.status(200).json({
          message: 'Image uploaded successfully!',
          imageUrl: result.secure_url, // URL to the uploaded image
        });
      }
    );

    // Pass the file buffer to Cloudinary's upload stream
    req.file.stream.pipe(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

module.exports = router;
