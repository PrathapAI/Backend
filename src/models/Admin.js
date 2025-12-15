import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Admin = sequelize.define('Admin', {
  AdminID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  LocationID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'locations',
      key: 'LocationID'
    }
  },
  photo: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'admins',
  timestamps: true
});

export default Admin;
