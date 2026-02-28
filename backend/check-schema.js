const { getPool } = require('./src/config/db');

async function checkSchema() {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Activities'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.table(result.recordset);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
