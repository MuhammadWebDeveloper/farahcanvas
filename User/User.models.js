const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['Portrait', 'Landscape', 'Abstract', 'Still Life'],
                message: "{VALUE} is not a supported category",
            },
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
        },
        sourceUrl: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Weighted text index for optimized search relevance
artworkSchema.index(
    { title: 'text', description: 'text' },
    { weights: { title: 5, description: 1 } }
);

module.exports = mongoose.model('Artwork', artworkSchema);