const asyncHandler = require('express-async-handler');
const postService = require('../services/post.service');

const createPost = asyncHandler(async (req, res) => {
  const { content, imageUrl } = req.body;
  
  // Get userId from request (sẽ được thay thế bằng auth middleware)
  const userId = req.body.userId || 1;

  const result = await postService.createPost(content, userId, imageUrl);

  res.status(201).json(result);
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const posts = await postService.getAllPosts(parseInt(limit) || 50);
  res.status(200).json(posts);
});

module.exports = {
  createPost,
  getAllPosts
};
