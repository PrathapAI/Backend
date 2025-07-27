import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  Password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  FirstName: DataTypes.STRING(50),
  LastName: DataTypes.STRING(50),
  PhoneNumber: DataTypes.STRING(20),
  DateRegistered: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  LastLogin: DataTypes.DATE,
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Users',
  timestamps: false
});

export default User;