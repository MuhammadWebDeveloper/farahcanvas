const express = require('express');
const { login, getProfile } = require('./Admin.controller');
const { protect } = require('../middleware/auth.middleware');
const Adminrouter = express.Router();


// Public route
Adminrouter.post('/login', login);

// Protected route
Adminrouter.get('/profile', protect, getProfile);

module.exports = Adminrouter;