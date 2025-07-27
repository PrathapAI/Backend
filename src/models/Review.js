import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Review = sequelize.define('Review', {
  ReviewID: {
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
  Rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  Comment: DataTypes.TEXT,
  ReviewDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Reviews',
  timestamps: false
});

export default Review;
