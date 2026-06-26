const express = require('express');
const Userrouter = express.Router();
const {
  getArtworks,
  getArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getCategories,
} = require('./User.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes
Userrouter.get('/getartwork', getArtworks);
Userrouter.get('/categories/list', getCategories);
Userrouter.get('/getartwork/:id', getArtwork);

// Protected routes (Admin only) - with file upload
Userrouter.post('/create', protect, upload.single('image'), createArtwork);
Userrouter.put('/updation/:id', protect, upload.single('image'), updateArtwork);
Userrouter.delete('/deletion/:id', protect, deleteArtwork);

module.exports = Userrouter;