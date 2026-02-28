const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { getPool } = require('../config/db');

// Get all notifications for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId || 2; // Default to userId = 2 for testing
        const pool = getPool();
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    notification_id,
                    user_id,
                    type,
                    title,
                    content,
                    message,
                    is_read,
                    created_at
                FROM Notifications
                WHERE user_id = @userId
                ORDER BY created_at DESC
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

// Get unread notifications count
router.get('/unread/count', async (req, res) => {
    try {
        const userId = req.query.userId || 2;
        const pool = getPool();
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT COUNT(*) as count
                FROM Notifications
                WHERE user_id = @userId AND is_read = 0
            `);
        
        res.json({ count: result.recordset[0].count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

// Mark notification as read
router.post('/:id/read', async (req, res) => {
    try {
        const notificationId = req.params.id;
        const pool = getPool();
        
        await pool.request()
            .input('notificationId', sql.Int, notificationId)
            .query(`
                UPDATE Notifications
                SET is_read = 1
                WHERE notification_id = @notificationId
            `);
        
        res.json({ message: 'Đánh dấu đã đọc thành công' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

// Mark all notifications as read
router.post('/read-all', async (req, res) => {
    try {
        const userId = req.body.userId || 2;
        const pool = getPool();
        
        await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                UPDATE Notifications
                SET is_read = 1
                WHERE user_id = @userId AND is_read = 0
            `);
        
        res.json({ message: 'Đánh dấu tất cả đã đọc thành công' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

// Delete notification
router.delete('/:id', async (req, res) => {
    try {
        const notificationId = req.params.id;
        const pool = getPool();
        
        await pool.request()
            .input('notificationId', sql.Int, notificationId)
            .query(`
                DELETE FROM Notifications
                WHERE notification_id = @notificationId
            `);
        
        res.json({ message: 'Xóa thông báo thành công' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

module.exports = router;
