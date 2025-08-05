import { Sequelize } from 'sequelize';



const sequelize = new Sequelize(
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

export default sequelize;
