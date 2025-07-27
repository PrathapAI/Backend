import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Report = sequelize.define('Report', {
  ReportID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ListingID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Listings',
      key: 'ListingID'
    }
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  },
  ReportReason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ReportDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  }
}, {
  tableName: 'Reports',
  timestamps: false
});

export default Report;
