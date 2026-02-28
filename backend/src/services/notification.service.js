const { getPool } = require('../config/db');

/**
 * Notification Service - Xử lý logic liên quan đến thông báo
 */

// Lấy tất cả thông báo của một user
const getNotificationsByUserId = async (userId, limit = 50) => {
  const pool = getPool();
  
  const result = await pool.request()
    .input('userId', userId)
    .input('limit', limit)
    .query(`
      SELECT TOP (@limit)
        notification_id,
        user_id,
        type,
        ref_id,
        content,
        is_read,
        created_at
      FROM Notifications
      WHERE user_id = @userId
      ORDER BY created_at DESC
    `);

  return result.recordset;
};

// Lấy số lượng thông báo chưa đọc
const getUnreadCount = async (userId) => {
  const pool = getPool();
  
  const result = await pool.request()
    .input('userId', userId)
    .query(`
      SELECT COUNT(*) as count
      FROM Notifications
      WHERE user_id = @userId AND is_read = 0
    `);

  return result.recordset[0].count;
};

// Tạo thông báo mới
const createNotification = async (userId, type, content, refId = null) => {
  const pool = getPool();
  
  const result = await pool.request()
    .input('userId', userId)
    .input('type', type)
    .input('content', content)
    .input('refId', refId)
    .query(`
      INSERT INTO Notifications (user_id, type, content, ref_id, is_read, created_at)
      VALUES (@userId, @type, @content, @refId, 0, SYSDATETIME());
      SELECT SCOPE_IDENTITY() AS notification_id;
    `);

  return result.recordset[0].notification_id;
};

// Đánh dấu một thông báo là đã đọc
const markAsRead = async (notificationId) => {
  const pool = getPool();
  
  await pool.request()
    .input('notificationId', notificationId)
    .query(`
      UPDATE Notifications
      SET is_read = 1
      WHERE notification_id = @notificationId
    `);
};

// Đánh dấu tất cả thông báo là đã đọc
const markAllAsRead = async (userId) => {
  const pool = getPool();
  
  await pool.request()
    .input('userId', userId)
    .query(`
      UPDATE Notifications
      SET is_read = 1
      WHERE user_id = @userId AND is_read = 0
    `);
};

// Xóa thông báo
const deleteNotification = async (notificationId) => {
  const pool = getPool();
  
  await pool.request()
    .input('notificationId', notificationId)
    .query(`
      DELETE FROM Notifications
      WHERE notification_id = @notificationId
    `);
};

module.exports = {
  getNotificationsByUserId,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
