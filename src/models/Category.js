import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Category = sequelize.define('Category', {
  CategoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CategoryName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ParentCategoryID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Categories',
      key: 'CategoryID'
    }
  },
  MaximumImagesAllowed: DataTypes.INTEGER,
  PostValidityIntervalInDays: DataTypes.INTEGER
}, {
  tableName: 'Categories',
  timestamps: false
});

export default Category;
