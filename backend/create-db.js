// backend/create-db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    console.log('🔌 Connecting to MySQL...');
    
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3307,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    console.log('✅ Connected to MySQL');
    
    const dbName = process.env.DB_NAME || 'persebaya_db';
    console.log(`📁 Creating database '${dbName}'...`);
    
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    console.log(`✅ Database '${dbName}' created successfully!`);
    console.log('💡 You can now run: node server.js');
    
    await conn.end();
  } catch (err) {
    console.error('❌ Failed to create database:', err.message);
    console.log('\n💡 Tips:');
    console.log('   1. Make sure MySQL is running (XAMPP Control Panel)');
    console.log('   2. Check your .env file configuration');
    console.log('   3. Default: DB_PORT=3306, DB_USER=root, DB_PASSWORD=""');
  }
}

createDatabase();