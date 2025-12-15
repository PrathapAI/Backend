import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Category from './Category.js';

const SubCategory = sequelize.define('SubCategory', {
  SubCategoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories', // Capital C
      key: 'CategoryID'
    }
  },
  SubCategoryName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'SubCategories',
  timestamps: false
});

Category.hasMany(SubCategory, { foreignKey: 'CategoryID' });
SubCategory.belongsTo(Category, { foreignKey: 'CategoryID' });

export default SubCategory;
