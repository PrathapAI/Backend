import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UserActivityLog = sequelize.define('UserActivityLog', {
  LogID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  },
  ActivityType: DataTypes.STRING(100),
  Timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Description: DataTypes.TEXT
}, {
  tableName: 'UserActivityLogs',
  timestamps: false
});

export default UserActivityLog;
