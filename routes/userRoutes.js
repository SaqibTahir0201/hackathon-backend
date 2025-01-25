const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.signUp); // Signup Route
router.post('/login', userController.login);   // Login Route

module.exports = router;
