const Artwork = require('./User.models');
const cloudinary = require('../config/cloudinary');

// @desc    Get all artworks
exports.getArtworks = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const artworks = await Artwork.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Artwork.countDocuments(query);

    res.status(200).json({
      success: true,
      count: artworks.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: artworks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get single artwork
exports.getArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).lean();

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found',
      });
    }

    res.status(200).json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create artwork with Cloudinary upload
exports.createArtwork = async (req, res) => {
  try {
    let imageUrl = req.body.image;
    let cloudinaryId = null;

    // If file is uploaded via multer, use Cloudinary URL
    if (req.file) {
      imageUrl = req.file.path;
      cloudinaryId = req.file.filename;
    }

    const artworkData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      image: imageUrl,
      cloudinaryId: cloudinaryId,
    };

    const artwork = await Artwork.create(artworkData);

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully',
      data: artwork,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update artwork
exports.updateArtwork = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If new file uploaded, update image
    if (req.file) {
      updateData.image = req.file.path;
      updateData.cloudinaryId = req.file.filename;

      // Delete old image from Cloudinary
      const oldArtwork = await Artwork.findById(req.params.id);
      if (oldArtwork && oldArtwork.cloudinaryId) {
        await cloudinary.uploader.destroy(oldArtwork.cloudinaryId);
      }
    }

    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artwork updated successfully',
      data: artwork,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete artwork
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found',
      });
    }

    // Delete image from Cloudinary
    if (artwork.cloudinaryId) {
      await cloudinary.uploader.destroy(artwork.cloudinaryId);
    }

    await Artwork.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Artwork deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Artwork.distinct('category');

    res.status(200).json({
      success: true,
      data: ['All', ...categories],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};