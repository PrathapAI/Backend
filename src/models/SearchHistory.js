import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const SearchHistory = sequelize.define('SearchHistory', {
  SearchID: {
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
  SearchQuery: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  SearchDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'SearchHistory',
  timestamps: false
});

export default SearchHistory;
