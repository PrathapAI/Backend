import { Sequelize } from 'sequelize';



const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'postgress_r037',
  process.env.POSTGRES_USER || 'postgress_r037_user',
  process.env.POSTGRES_PASSWORD || 'ChjBYwsxjbQDwQiRLpeQtHhGHR5vpJbq',
  {
    host: process.env.POSTGRES_HOST || 'dpg-d22v5i6mcj7s73d1090g-a',
    dialect: 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    logging: console.log, // Enable logging to see SQL queries and errors
  }
);

export default sequelize;
