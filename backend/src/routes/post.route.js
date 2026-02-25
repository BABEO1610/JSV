const express = require('express');
const router = express.Router();
const { createPost, getAllPosts } = require('../controllers/post.controller');

// POST /api/posts - Create a new post
router.post('/', createPost);

// GET /api/posts - Get all posts (nếu cần)
router.get('/', getAllPosts);

module.exports = router;
