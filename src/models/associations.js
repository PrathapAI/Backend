import SubCategory from './SubCategory.js';
// SubCategory - Listing
SubCategory.hasMany(Listing, { foreignKey: 'SubCategoryID', sourceKey: 'SubCategoryID' });
Listing.belongsTo(SubCategory, { foreignKey: 'SubCategoryID', targetKey: 'SubCategoryID' });
import Admin from './Admin.js';

// Admin joins
Admin.belongsTo(User, { foreignKey: 'userid', targetKey: 'UserID', as: 'user' });
Admin.belongsTo(Location, { foreignKey: 'locationkey', targetKey: 'LocationID', as: 'location' });
import Location from './Location.js';
// Location - Listing
Location.hasMany(Listing, { foreignKey: 'LocationID', sourceKey: 'LocationID' });
Listing.belongsTo(Location, { foreignKey: 'LocationID', targetKey: 'LocationID' });
import User from './User.js';
import Listing from './Listing.js';
import Category from './Category.js';
import ListingImage from './ListingImage.js';

// User - Listing
User.hasMany(Listing, { foreignKey: 'UserID', sourceKey: 'UserID' });
Listing.belongsTo(User, { foreignKey: 'UserID', targetKey: 'UserID' });

// Category - Listing
Category.hasMany(Listing, { foreignKey: 'CategoryID', sourceKey: 'CategoryID' });
Listing.belongsTo(Category, { foreignKey: 'CategoryID', targetKey: 'CategoryID' });

// Listing - ListingImage
Listing.hasMany(ListingImage, { foreignKey: 'ListingID', sourceKey: 'ListingID' });
ListingImage.belongsTo(Listing, { foreignKey: 'ListingID', targetKey: 'ListingID' });
