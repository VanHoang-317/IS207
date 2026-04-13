const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, '../models/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema setup...');
        await pool.query(schema);
        console.log('Schema setup completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDb();
