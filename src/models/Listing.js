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
  Description: DataTypes.TEXT,
  ExpectedPrice: DataTypes.DECIMAL(12,2),
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


import SubCategory from './SubCategory.js';
import ListingImage from './ListingImage.js';

Listing.belongsTo(SubCategory, { foreignKey: 'SubCategoryID' });
SubCategory.hasMany(Listing, { foreignKey: 'SubCategoryID' });

Listing.hasMany(ListingImage, { foreignKey: 'ListingID', as: 'ListingImages' });
ListingImage.belongsTo(Listing, { foreignKey: 'ListingID' });

export default Listing;
