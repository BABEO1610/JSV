const postService = require('../services/post.service');

const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Get userId from request body (sẽ được thay thế bằng auth middleware)
    const userId = req.body.userId || 1;

    const result = await postService.createPost(content, userId, imageUrl);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { limit } = req.query;
    const posts = await postService.getAllPosts(parseInt(limit) || 50);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getAllPosts
};
