import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const ExpertBid = sequelize.define('ExpertBid', {
  BidID: {
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
  ExpertID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Experts',
      key: 'ExpertID'
    }
  },
  // Bid details
  BidAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Amount expert is willing to charge for their service'
  },
  CommissionPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Commission percentage if applicable'
  },
  Proposal: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Expert proposal on how they will sell the product/service'
  },
  EstimatedCompletionDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Estimated days to complete the sale'
  },
  // Status tracking
  Status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'accepted', 'rejected', 'withdrawn', 'completed']]
    }
  },
  // User who posted the listing can accept/reject
  ReviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  },
  ReviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ReviewNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Timestamps
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Completion tracking
  CompletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Performance tracking
  SaleAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Actual sale amount if completed'
  }
}, {
  tableName: 'ExpertBids',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

export default ExpertBid;
