import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UserRole = sequelize.define('UserRole', {
  RoleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RoleName: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  Description: DataTypes.TEXT
}, {
  tableName: 'UserRoles',
  timestamps: false
});

export default UserRole;
