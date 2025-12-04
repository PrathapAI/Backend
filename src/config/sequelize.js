import { Sequelize } from 'sequelize';

// Check if DATABASE_URL is valid
const isDatabaseUrlValid = () => {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim() === '') return false;
  // Check if it starts with postgres:// or postgresql://
  return url.startsWith('postgres://') || url.startsWith('postgresql://');
};

const sequelize = isDatabaseUrlValid()
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: console.log, // Enable logging to see SQL queries and errors
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // For cloud databases
        },
      },
    })
  : new Sequelize(
      process.env.POSTGRES_DB || 'postgres',
      process.env.POSTGRES_USER || 'postgres',
      process.env.POSTGRES_PASSWORD || 'password',
      {
        host: process.env.POSTGRES_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.POSTGRES_PORT || 5432,
        logging: console.log, // Enable logging to see SQL queries and errors
      }
    );

// Log which connection method is being used
console.log('🔌 Database connection method:', isDatabaseUrlValid() ? 'DATABASE_URL' : 'Individual credentials');

export default sequelize;