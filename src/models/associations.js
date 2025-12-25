import User from './User.js';
import Listing from './Listing.js';
import Category from './Category.js';
import ListingImage from './ListingImage.js';
import SubCategory from './SubCategory.js';
import Admin from './Admin.js';
import Location from './Location.js';
import Review from './Review.js';
import Favorite from './Favorite.js';
import Message from './Message.js';
import SearchHistory from './SearchHistory.js';
import Notification from './Notification.js';
import Expert from './Expert.js';
import ExpertBid from './ExpertBid.js';

// User - Listing
User.hasMany(Listing, { foreignKey: 'UserID', sourceKey: 'UserID' });
Listing.belongsTo(User, { foreignKey: 'UserID', targetKey: 'UserID' });

// Category - Listing
Category.hasMany(Listing, { foreignKey: 'CategoryID', sourceKey: 'CategoryID' });
Listing.belongsTo(Category, { foreignKey: 'CategoryID', targetKey: 'CategoryID' });

// Listing - ListingImage
Listing.hasMany(ListingImage, { foreignKey: 'ListingID', sourceKey: 'ListingID', as: 'ListingImages' });
ListingImage.belongsTo(Listing, { foreignKey: 'ListingID', targetKey: 'ListingID' });

// SubCategory - Listing
SubCategory.hasMany(Listing, { foreignKey: 'SubCategoryID', sourceKey: 'SubCategoryID' });
Listing.belongsTo(SubCategory, { foreignKey: 'SubCategoryID', targetKey: 'SubCategoryID' });

// Location - Listing
Location.hasMany(Listing, { foreignKey: 'LocationID', sourceKey: 'LocationID' });
Listing.belongsTo(Location, { foreignKey: 'LocationID', targetKey: 'LocationID' });

// Admin joins
Admin.belongsTo(User, { foreignKey: 'userid', targetKey: 'UserID', as: 'user' });
Admin.belongsTo(Location, { foreignKey: 'locationkey', targetKey: 'LocationID', as: 'location' });

// User - Review
User.hasMany(Review, { foreignKey: 'UserID', sourceKey: 'UserID' });
Review.belongsTo(User, { foreignKey: 'UserID', targetKey: 'UserID' });

// Listing - Review
Listing.hasMany(Review, { foreignKey: 'ListingID', sourceKey: 'ListingID' });
Review.belongsTo(Listing, { foreignKey: 'ListingID', targetKey: 'ListingID' });

// User - Favorite
User.hasMany(Favorite, { foreignKey: 'UserID', sourceKey: 'UserID' });
Favorite.belongsTo(User, { foreignKey: 'UserID', targetKey: 'UserID' });

// Listing - Favorite
Listing.hasMany(Favorite, { foreignKey: 'ListingID', sourceKey: 'ListingID' });
Favorite.belongsTo(Listing, { foreignKey: 'ListingID', targetKey: 'ListingID' });

// Message associations (Sender and Recipient are both Users)
User.hasMany(Message, { foreignKey: 'SenderID', sourceKey: 'UserID', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'RecipientID', sourceKey: 'UserID', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'SenderID', targetKey: 'UserID', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'RecipientID', targetKey: 'UserID', as: 'Recipient' });

// Listing - Message (optional, messages can be about a listing)
Listing.hasMany(Message, { foreignKey: 'ListingID', sourceKey: 'ListingID' });
Message.belongsTo(Listing, { foreignKey: 'ListingID', targetKey: 'ListingID' });

// User - SearchHistory
User.hasMany(SearchHistory, { foreignKey: 'UserID', sourceKey: 'UserID' });
SearchHistory.belongsTo(User, { foreignKey: 'UserID', targetKey: 'UserID' });

// User - Notification
User.hasMany(Notification, { foreignKey: 'UserID', sourceKey: 'UserID' });
Notification.belongsTo(User, { foreignKey: 'UserID', targetKey: 'UserID' });

// Expert - Location
Location.hasMany(Expert, { foreignKey: 'LocationID', sourceKey: 'LocationID' });
Expert.belongsTo(Location, { foreignKey: 'LocationID', targetKey: 'LocationID' });

// Expert - ExpertBid
Expert.hasMany(ExpertBid, { foreignKey: 'ExpertID', sourceKey: 'ExpertID' });
ExpertBid.belongsTo(Expert, { foreignKey: 'ExpertID', targetKey: 'ExpertID' });

// Listing - ExpertBid
Listing.hasMany(ExpertBid, { foreignKey: 'ListingID', sourceKey: 'ListingID', as: 'ExpertBids' });
ExpertBid.belongsTo(Listing, { foreignKey: 'ListingID', targetKey: 'ListingID' });

// User - ExpertBid (for reviewing bids)
User.hasMany(ExpertBid, { foreignKey: 'ReviewedBy', sourceKey: 'UserID', as: 'ReviewedBids' });
ExpertBid.belongsTo(User, { foreignKey: 'ReviewedBy', targetKey: 'UserID', as: 'Reviewer' });

// Listing - Expert (assigned expert)
Expert.hasMany(Listing, { foreignKey: 'ExpertID', sourceKey: 'ExpertID', as: 'AssignedListings' });
Listing.belongsTo(Expert, { foreignKey: 'ExpertID', targetKey: 'ExpertID', as: 'AssignedExpert' });

