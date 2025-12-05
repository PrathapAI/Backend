import { Sequelize } from 'sequelize';

// Use DATABASE_URL if available (for Render), otherwise use individual credentials
let sequelize;

if (process.env.DATABASE_URL) {
  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL.trim();
  
  // Check if URL starts with postgres:// or postgresql://
  if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
    console.log('Using DATABASE_URL for connection');
    sequelize = new Sequelize(dbUrl, {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
  } else {
    console.error('Invalid DATABASE_URL format. Expected postgresql:// or postgres://');
    console.log('DATABASE_URL starts with:', dbUrl.substring(0, 20));
    throw new Error('Invalid DATABASE_URL format');
  }
} else {
  // Fallback to individual parameters
  console.log('Using individual connection parameters');
  sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'postgress_r037',
    process.env.POSTGRES_USER || 'postgress_r037_user',
    process.env.POSTGRES_PASSWORD || 'ChjBYwsxjbQDwQiRLpeQtHhGHR5vpJbq',
    {
      host: process.env.POSTGRES_HOST || 'dpg-d22v5i6mcj7s73d1090g-a',
      dialect: 'postgres',
      port: process.env.POSTGRES_PORT || 5432,
      logging: console.log,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );
}

export default sequelize;
