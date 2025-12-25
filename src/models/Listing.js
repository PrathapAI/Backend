import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Listing = sequelize.define('Listing', {
  SubCategoryID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'SubCategories',
      key: 'SubCategoryID'
    }
  },
  ListingID: {
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
  ExpertID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Experts',
      key: 'ExpertID'
    }
  },
  ExpertAssignedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'CategoryID'
    }
  },
  Title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Listing_Type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CampaignStartDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CampaignEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Description: DataTypes.TEXT,
  ExpectedPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  IsPriceNegotiable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  LocationID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreateDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  LastRenewedOn: DataTypes.DATE,
  IsSeller: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  IsIndividual: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  ImageURL: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Listings',
  timestamps: false
});

export default Listing;
