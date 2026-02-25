const { getPool } = require('../config/db');

const createPost = async (content, userId, imageUrl = null) => {
  try {
    const pool = getPool();
    
    // Tính expires_at = created_at + 1 ngày
    const result = await pool.request()
      .input('userId', userId)
      .input('content', content)
      .input('imageUrl', imageUrl)
      .query(`
        INSERT INTO DailyStatus (user_id, content, image_url, created_at, expires_at)
        VALUES (@userId, @content, @imageUrl, SYSDATETIME(), DATEADD(day, 1, SYSDATETIME()));
        SELECT SCOPE_IDENTITY() AS status_id;
      `);

    const statusId = result.recordset[0].status_id;

    // Return the created post
    const post = await pool.request()
      .input('statusId', statusId)
      .query('SELECT * FROM DailyStatus WHERE status_id = @statusId');

    return post.recordset[0];
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

const getAllPosts = async (limit = 50) => {
  try {
    const pool = getPool();
    
    const result = await pool.request()
      .input('limit', limit)
      .query(`
        SELECT ds.*, u.username, u.full_name, u.avatar_url
        FROM DailyStatus ds
        INNER JOIN Users u ON ds.user_id = u.user_id
        WHERE ds.expires_at > SYSDATETIME()
        ORDER BY ds.created_at DESC
        FETCH NEXT @limit ROWS ONLY
      `);

    return result.recordset;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

module.exports = {
  createPost,
  getAllPosts
};
