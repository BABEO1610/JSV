const express = require('express');
const router = express.Router();
const sql = require('mssql');
// Import pool kết nối từ file db.js của bạn
const { getPool } = require('../config/db'); 

// API Lấy danh sách hoạt động chờ duyệt
router.get('/pending-activities', async (req, res) => {
    try {
        const pool = getPool();
        
        // CÂU LỆNH SQL: Chỉ lấy các hoạt động có status là chờ duyệt
        // Đổi tên cột activity_id thành 'id', title thành 'name' cho khớp với Frontend của bạn
        const result = await pool.request().query(`
            SELECT activity_id AS id, title AS name 
            FROM Activities 
            WHERE status = 'pending' 
        `);
        
        // Trả dữ liệu về cho Frontend
        res.json(result.recordset); 
        
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        res.status(500).json({ message: "Lỗi Server" });
    }
});
router.delete('/pending-activities/:id', async (req, res) => {
    try {
        const pool = getPool();
        const activityId = req.params.id; // Lấy ID của nhóm từ URL Frontend gửi lên
        
        // Dùng tham số @id để bảo mật, chống hack (SQL Injection)
        await pool.request()
            .input('id', sql.Int, activityId)
            .query(`
                UPDATE Activities 
                SET status = 'rejected' 
                WHERE activity_id = @id
            `);
            
        res.json({ message: "Đã từ chối hoạt động thành công!" });
    } catch (error) {
        console.error("Lỗi khi hủy chờ:", error);
        res.status(500).json({ message: "Lỗi Server" });
    }
});

module.exports = router;