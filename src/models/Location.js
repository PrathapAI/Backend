
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Location = sequelize.define('Location', {
  LocationID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mandal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  village: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'locations',
  timestamps: true
});

export default Location;
