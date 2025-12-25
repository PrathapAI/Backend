import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Expert = sequelize.define('Expert', {
  ExpertID: {
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
  FirstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  PhoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  // Expertise areas: Real Estate, Marriage Bureau, Job Assistance
  ExpertiseArea: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Real Estate', 'Marriage Bureau', 'Job Assistance']]
    }
  },
  // Location details for expert
  LocationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'locations',
      key: 'LocationID'
    }
  },
  // Additional location preferences (can serve multiple areas)
  ServiceAreas: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of LocationIDs where expert provides services'
  },
  // Professional details
  YearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Certifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Commission and pricing
  CommissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Commission percentage expert charges'
  },
  MinimumBidAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  // Profile and verification
  ProfileImageURL: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  IsVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Statistics
  SuccessfulSales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  TotalBids: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  Rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  // Timestamps
  DateRegistered: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  LastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Notification preferences
  EmailNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  SMSNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Experts',
  timestamps: true,
  createdAt: 'DateRegistered',
  updatedAt: 'UpdatedAt'
});

export default Expert;
