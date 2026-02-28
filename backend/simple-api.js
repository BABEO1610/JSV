const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple routes
app.post('/api/posts', async (req, res) => {
  try {
    console.log('POST /api/posts called with:', req.body);
    
    // Simple DB test
    const pool = await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    });
    
    const result = await pool.request()
      .input('title', sql.NVarChar(sql.MAX), req.body.title || 'Test')
      .input('desc', sql.NVarChar(sql.MAX), req.body.description || '')
      .input('loc', sql.NVarChar(100), req.body.location || '')
      .input('creator', sql.Int, 2)
      .input('maxP', sql.Int, 10)
      .input('dur', sql.Int, 60)
      .query(`
        INSERT INTO Activities (creator_id, title, description, location, max_participants, duration_minutes, status, created_at)
        VALUES (@creator, @title, @desc, @loc, @maxP, @dur, 'active', SYSDATETIME());
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    await pool.close();
    res.json({ success: true, id: result.recordset[0].id });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => res.json({ status: 'ok' }));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Simple server running on ${PORT}`);
});
