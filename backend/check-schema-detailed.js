const sql = require('mssql');
require('dotenv').config();

async function checkSchema() {
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

    console.log('=== Activities Table Columns ===');
    const columns = await pool.request()
      .query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'Activities'
        ORDER BY ORDINAL_POSITION
      `);
    console.table(columns.recordset);

    console.log('\n=== Triggers on Activities ===');
    const triggers = await pool.request()
      .query(`
        SELECT * FROM sys.triggers WHERE parent_class_desc = 'OBJECT_OR_COLUMN'
        AND parent_id = (SELECT object_id FROM sys.objects WHERE name = 'Activities')
      `);
    console.table(triggers.recordset);

    console.log('\n=== Stored Procedures using Activities ===');
    const procs = await pool.request()
      .query(`
        SELECT DISTINCT sp.name
        FROM sys.sql_modules sm
        JOIN sys.procedures sp ON sm.object_id = sp.object_id
        WHERE sm.definition LIKE '%Activities%'
      `);
    console.table(procs.recordset);

    console.log('\n=== Checking for DEFAULT constraints ===');
    const defaults = await pool.request()
      .query(`
        SELECT COLUMN_NAME, COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'Activities'
        AND COLUMN_DEFAULT IS NOT NULL
      `);
    console.table(defaults.recordset);

    await pool.close();
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkSchema();
