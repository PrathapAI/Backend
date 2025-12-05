import { Sequelize } from 'sequelize';

// Use DATABASE_URL if available (for Render), otherwise use individual credentials
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.POSTGRES_DB || 'postgress_r037',
      process.env.POSTGRES_USER || 'postgress_r037_user',
      process.env.POSTGRES_PASSWORD || 'ChjBYwsxjbQDwQiRLpeQtHhGHR5vpJbq',
      {
        host: process.env.POSTGRES_HOST || 'dpg-d22v5i6mcj7s73d1090g-a.oregon-postgres.render.com',
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

export default sequelize;
