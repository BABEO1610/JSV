const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testQuery() {
  try {
    console.log('Connecting to database...');
    const pool = await sql.connect(dbConfig);
    console.log('Connected! Running test query...');
    
    const result = await pool.request()
      .query('SELECT @@VERSION as version');
    
    console.log('SQL Server version:', result.recordset[0].version);
    
    // Try simple INSERT into Activities
    const result2 = await pool.request()
      .input('creatorId', sql.Int, 2)
      .input('title', sql.NVarChar(sql.MAX), 'Test Title')
      .input('description', sql.NVarChar(sql.MAX), 'Test Desc')
      .input('location', sql.NVarChar(100), 'Test Location')
      .input('maxParts', sql.Int, 10)
      .input('duration', sql.Int, 60)
      .query(`
        INSERT INTO Activities (creator_id, title, description, location, max_participants, duration_minutes, status, created_at)
        VALUES (@creatorId, @title, @description, @location, @maxParts, @duration, 'active', SYSDATETIME());
        SELECT SCOPE_IDENTITY() AS activity_id;
      `);
    
    console.log('✅ Inserted activity ID:', result2.recordset[0].activity_id);
    
    pool.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full stack:', error);
  }
}

testQuery();
