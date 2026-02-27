const { getPool } = require('../config/db');

/**
 * Model - Xử lý trực tiếp với database
 * Chỉ chứa các câu lệnh SQL thuần (INSERT, SELECT, UPDATE, DELETE)
 */

// INSERT bài viết vào bảng DailyStatus
const insertPost = async (userId, content, imageUrl = null) => {
  const pool = getPool();
  
  const result = await pool.request()
    .input('userId', userId)
    .input('content', content)
    .input('imageUrl', imageUrl)
    .query(`
      INSERT INTO DailyStatus (user_id, content, image_url, created_at, expires_at)
      VALUES (@userId, @content, @imageUrl, SYSDATETIME(), DATEADD(day, 1, SYSDATETIME()));
      SELECT SCOPE_IDENTITY() AS status_id;
    `);

  return result.recordset[0].status_id;
};

// Lấy bài viết theo ID
const getPostById = async (statusId) => {
  const pool = getPool();
  
  const result = await pool.request()
    .input('statusId', statusId)
    .query('SELECT * FROM DailyStatus WHERE status_id = @statusId');

  return result.recordset[0];
};

// Lấy tất cả bài viết (chưa hết hạn)
const getAllPosts = async (limit = 50) => {
  const pool = getPool();
  
  const result = await pool.request()
    .input('limit', limit)
    .query(`
      SELECT TOP (@limit) ds.*, u.username, u.full_name, u.avatar_url
      FROM DailyStatus ds
      INNER JOIN Users u ON ds.user_id = u.user_id
      WHERE ds.expires_at > SYSDATETIME()
      ORDER BY ds.created_at DESC
    `);

  return result.recordset;
};

module.exports = {
  insertPost,
  getPostById,
  getAllPosts
};
