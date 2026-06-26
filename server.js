require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./database/Db.confige');
const Adminrouter = require('./Admin/Admin.routes');
const Userrouter = require('./User/User.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/admin', Adminrouter);
app.use('/api/artworks', Userrouter);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Canvas Showcase API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));