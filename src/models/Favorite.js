import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Favorite = sequelize.define('Favorite', {
  FavoriteID: {
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
  ListingID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Listings',
      key: 'ListingID'
    }
  },
  DateAdded: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Favorites',
  timestamps: false
});

export default Favorite;
