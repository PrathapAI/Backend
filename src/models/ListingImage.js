import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const ListingImage = sequelize.define('ListingImage', {
  ImageID: {
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
  ImageURL: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Ordinal: DataTypes.INTEGER
}, {
  tableName: 'ListingImages',
  timestamps: false
});

export default ListingImage;
