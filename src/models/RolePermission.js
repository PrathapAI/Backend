import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const RolePermission = sequelize.define('RolePermission', {
  RoleID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'UserRoles',
      key: 'RoleID'
    },
    primaryKey: true
  },
  PermissionID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'UserPermissions',
      key: 'PermissionID'
    },
    primaryKey: true
  }
}, {
  tableName: 'RolePermissions',
  timestamps: false
});

export default RolePermission;
