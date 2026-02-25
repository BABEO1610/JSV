const express = require('express');
const router = express.Router();

// Import routes
const postRoutes = require('./post.route');

// Use routes
router.use('/posts', postRoutes);

// Add more routes here as the app grows
// const userRoutes = require('./user.route');
// router.use('/users', userRoutes);

module.exports = router;
