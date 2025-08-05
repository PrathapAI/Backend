import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UserPermission = sequelize.define('UserPermission', {
  PermissionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PermissionName: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  Description: DataTypes.TEXT
}, {
  tableName: 'UserPermissions',
  timestamps: false
});

export default UserPermission;
