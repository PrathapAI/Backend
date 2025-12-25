import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration from environment variables (matches sequelize.js)
const dbConfig = {
  host: process.env.POSTGRES_HOST || 'dpg-d22v5i6mcj7s73d1090g-a.oregon-postgres.render.com',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'postgress_r037',
  user: process.env.POSTGRES_USER || 'postgress_r037_user',
  password: process.env.POSTGRES_PASSWORD || 'ChjBYwsxjbQDwQiRLpeQtHhGHR5vpJbq',
  ssl: { rejectUnauthorized: false } // Required for Render.com PostgreSQL
};

async function runMigration() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'add-expert-system-postgres.sql');
    console.log(`📄 Reading migration file: ${migrationPath}`);
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log(`✅ Migration file loaded (${sql.length} characters)\n`);

    // Execute the migration
    console.log('🚀 Running migration...');
    await client.query(sql);
    console.log('✅ Migration completed successfully!\n');

    // Run verification queries
    console.log('🔍 Verifying installation...\n');

    // Check if tables exist
    const tablesCheck = await client.query(`
      SELECT 
        table_name,
        CASE WHEN table_name = 'Experts' THEN '✓ Experts table created'
             WHEN table_name = 'ExpertBids' THEN '✓ ExpertBids table created'
        END as status
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('Experts', 'ExpertBids')
      ORDER BY table_name;
    `);

    tablesCheck.rows.forEach(row => {
      console.log(row.status);
    });

    // Check categories
    const categoriesCheck = await client.query(`
      SELECT "CategoryName" FROM "Categories" 
      ORDER BY "CategoryName";
    `);

    console.log('\n📋 Categories:');
    categoriesCheck.rows.forEach(row => {
      console.log(`   - ${row.CategoryName}`);
    });

    // Check indexes
    const indexCount = await client.query(`
      SELECT COUNT(*) as count
      FROM pg_indexes 
      WHERE schemaname = 'public' 
        AND tablename IN ('Experts', 'ExpertBids');
    `);

    console.log(`\n📊 Created ${indexCount.rows[0].count} indexes`);

    // Check foreign keys
    const fkCount = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND constraint_type = 'FOREIGN KEY'
        AND table_name IN ('Experts', 'ExpertBids', 'Listings');
    `);

    console.log(`🔗 Created ${fkCount.rows[0].count} foreign key constraints`);

    console.log('\n✅ Expert system migration completed successfully!');
    console.log('\n🎉 You can now:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Register as an expert: http://localhost:5173/expert/register');
    console.log('   3. Create listings and place bids\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the migration
runMigration();
