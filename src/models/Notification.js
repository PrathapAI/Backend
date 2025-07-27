import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Notification = sequelize.define('Notification', {
  NotificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  },
  NotificationType: DataTypes.STRING(50),
  Message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  IsRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  Timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Notifications',
  timestamps: false
});

export default Notification;
