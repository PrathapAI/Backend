import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const ListingProperty = sequelize.define('ListingProperty', {
  PropertyID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'CategoryID'
    }
  },
  PropertyName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  PropertyUnit: DataTypes.STRING(20),
  IsMandatory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ScreenControlID: DataTypes.STRING(50),
  PossibleValues: DataTypes.TEXT
}, {
  tableName: 'ListingProperties',
  timestamps: false
});

export default ListingProperty;
