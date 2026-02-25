const API_BASE_URL = '/api';

export const postService = {
  createPost: async (content) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Create post failed');
    }

    return response.json();
  },
};

export default postService;