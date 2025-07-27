import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Message = sequelize.define('Message', {
  MessageID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  SenderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  },
  RecipientID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  },
  ListingID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Listings',
      key: 'ListingID'
    }
  },
  MessageContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Messages',
  timestamps: false
});

export default Message;
