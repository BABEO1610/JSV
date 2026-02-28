const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { getPool } = require('../config/db');

const notificationRoutes = require('./notification.route');
const postRoutes = require('./post.route');

router.use('/notifications', notificationRoutes);
router.use('/posts', postRoutes);

// =============================================
// GET /api/pending-activities?userId=X
// Lấy danh sách yêu cầu tham gia đang chờ duyệt của user
// =============================================
router.get('/pending-activities', async (req, res) => {
  try {
    const pool = getPool();
    const userId = parseInt(req.query.userId) || 2;

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          ar.request_id AS id,
          a.activity_id,
          a.title AS name,
          a.location,
          ar.created_at AS request_date,
          u.full_name AS creator_name,
          u.avatar_url AS creator_avatar,
          ar.status AS request_status
        FROM ActivityRequests ar
        INNER JOIN Activities a ON ar.activity_id = a.activity_id
        LEFT JOIN Users u ON a.creator_id = u.user_id
        WHERE ar.requester_id = @userId AND ar.status = 'pending'
        ORDER BY ar.created_at DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi khi lấy pending activities:', error);
    res.status(500).json({ message: 'Lỗi Server' });
  }
});

// =============================================
// DELETE /api/pending-activities/:id
// Hủy yêu cầu tham gia (xóa hẳn record)
// FIX: Đây là cancel request, nên DELETE thực sự thay vì UPDATE Activities
// =============================================
router.delete('/pending-activities/:id', async (req, res) => {
  try {
    const pool = getPool();
    const requestId = parseInt(req.params.id);

    await pool.request()
      .input('id', sql.Int, requestId)
      .query(`DELETE FROM ActivityRequests WHERE request_id = @id`);

    res.json({ message: 'Đã hủy yêu cầu tham gia thành công!' });
  } catch (error) {
    console.error('Lỗi khi hủy yêu cầu:', error);
    res.status(500).json({ message: 'Lỗi Server' });
  }
});

// =============================================
// GET /api/activities
// Lấy danh sách hoạt động (status = 'approved')
// FIX: thay 'active' → 'approved' cho đúng schema
// =============================================
router.get('/activities', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT TOP 50
        a.activity_id AS status_id,
        a.creator_id AS user_id,
        a.title AS content,
        a.description AS extra_content,
        a.location,
        a.max_participants,
        a.duration_minutes,
        a.created_at,
        u.username,
        u.full_name,
        u.avatar_url,
        (SELECT TOP 1 ai.image_url FROM ActivityImages ai WHERE ai.activity_id = a.activity_id) AS image_url
      FROM Activities a
      LEFT JOIN Users u ON a.creator_id = u.user_id
      WHERE a.status = 'approved'
      ORDER BY a.created_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Lỗi khi lấy hoạt động:', error);
    res.status(500).json({ message: 'Lỗi Server' });
  }
});

// =============================================
// POST /api/activities/join
// Tham gia hoạt động + gửi notification cho chủ bài
// =============================================
router.post('/activities/join', async (req, res) => {
  try {
    const pool = getPool();
    const { activityId, userId } = req.body;

    if (!activityId || !userId) {
      return res.status(400).json({ message: 'activityId và userId là bắt buộc' });
    }

    // Lấy thông tin activity để kiểm tra chủ bài
    const activityResult = await pool.request()
      .input('activityId', sql.Int, activityId)
      .query(`SELECT creator_id, title FROM Activities WHERE activity_id = @activityId`);

    if (activityResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hoạt động' });
    }

    const activity = activityResult.recordset[0];

    // Chủ bài không thể tự tham gia
    if (activity.creator_id === parseInt(userId)) {
      return res.status(400).json({ message: 'Bạn là chủ của hoạt động này' });
    }

    // Kiểm tra đã gửi yêu cầu chưa
    const existing = await pool.request()
      .input('activityId', sql.Int, activityId)
      .input('userId', sql.Int, userId)
      .query(`
        SELECT request_id FROM ActivityRequests 
        WHERE activity_id = @activityId AND requester_id = @userId
      `);

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: 'Bạn đã gửi yêu cầu tham gia hoạt động này rồi' });
    }

    // Lấy tên người gửi yêu cầu
    const requesterResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT full_name, username FROM Users WHERE user_id = @userId`);

    const requesterName = requesterResult.recordset[0]?.full_name
      || requesterResult.recordset[0]?.username
      || 'Ai đó';

    // Tạo yêu cầu tham gia
    const result = await pool.request()
      .input('activityId', sql.Int, activityId)
      .input('userId', sql.Int, userId)
      .query(`
        INSERT INTO ActivityRequests (activity_id, requester_id, status, created_at)
        VALUES (@activityId, @userId, 'pending', SYSDATETIME());
        SELECT SCOPE_IDENTITY() AS request_id;
      `);

    const requestId = result.recordset[0].request_id;

    // Gửi notification cho chủ bài
    await pool.request()
      .input('creatorId', sql.Int, activity.creator_id)
      .input('content', sql.NVarChar(500), `${requesterName} muốn tham gia hoạt động "${activity.title}" của bạn`)
      .input('refId', sql.Int, requestId)
      .query(`
        INSERT INTO Notifications (user_id, type, content, ref_id, is_read, created_at)
        VALUES (@creatorId, 'activity_request', @content, @refId, 0, SYSDATETIME())
      `);

    res.status(201).json({
      message: 'Gửi yêu cầu tham gia thành công, chờ chủ hoạt động phê duyệt',
      requestId
    });
  } catch (error) {
    console.error('Lỗi khi tham gia hoạt động:', error);
    res.status(500).json({ message: 'Lỗi Server: ' + error.message });
  }
});

module.exports = router;