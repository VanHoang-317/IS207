const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const runSchema = async () => {
    try {
        const schemaPath = path.join(__dirname, '../models/schema.sql');
        console.log(`Reading SQL schema from ${schemaPath}...`);
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema queries...');
        await pool.query(sql);
        console.log('Database upgrade completed successfully! 🎉');
        process.exit(0);
    } catch (err) {
        console.error('Error executing database upgrade:', err);
        process.exit(1);
    }
};

runSchema();
