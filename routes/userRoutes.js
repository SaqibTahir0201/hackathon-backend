const express = require('express');
const { signUp, login } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signUp); // Signup Route
router.post('/login', login);   // Login Route

module.exports = router;
