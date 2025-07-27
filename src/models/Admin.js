import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Admin = sequelize.define('Admin', {
  userid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
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
