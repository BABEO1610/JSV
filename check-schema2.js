const sql = require('mssql');
require('dotenv').config();

async function checkSchema() {
  try {
    const pool = await sql.connect({
      server: process.env.DB_SERVER || 'ADMIN\\SQLEXPRESS',
      database: process.env.DB_NAME || 'SoThichDB',
      authentication: {
        type: 'default',
        options: {
          userName: process.env.DB_USER || 'sa',
          password: process.env.DB_PASSWORD || 'P@ssw0rd'
        }
      },
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERT !== 'false'
      }
    });
    
    const result = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Activities'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('\n== ACTIVITIES TABLE SCHEMA ==');
    result.recordset.forEach(col => {
      console.log(`${col.COLUMN_NAME}: ${col.DATA_TYPE} (NULL: ${col.IS_NULLABLE})`);
    });
    
    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
