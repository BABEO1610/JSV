const sql = require('mssql');
require('dotenv').config();

async function testinsert() {
  try {
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

    console.log('Testing INSERT with proper .input() parameters...');
    
    const result = await pool.request()
      .input('creatorId', sql.Int, 2)
      .input('title', sql.NVarChar(sql.MAX), 'Test Title')
      .input('description', sql.NVarChar(sql.MAX), 'Test Description')
      .input('location', sql.NVarChar(100), 'Test Location')
      .input('maxParticipants', sql.Int, 10)
      .input('duration', sql.Int, 60)
      .query(`
        INSERT INTO Activities (creator_id, title, description, location, max_participants, duration_minutes, status, created_at)
        VALUES (@creatorId, @title, @description, @location, @maxParticipants, @duration, 'active', SYSDATETIME());
        SELECT SCOPE_IDENTITY() AS activity_id;
      `);
    
    console.log('SUCCESS! Inserted ID:', result.recordset[0].activity_id);
    
    await pool.close();
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testinsert();
