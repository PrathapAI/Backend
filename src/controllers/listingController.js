import Listing from '../models/Listing.js';
import ListingImage from '../models/ListingImage.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';

export const getListings = async (req, res) => {
  try {
    const ListingImage = (await import('../models/ListingImage.js')).default;
    const listings = await Listing.findAll({
      attributes: [
        'ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsPriceNegotiable', 'IsActive', 'IsSeller', 'IsIndividual', 'CreateDate', 'LocationID', 'CategoryID', 'ImageURL'
      ],
      include: [
        {
          model: User,
          attributes: [['Username', 'name'], 'Email', ['PhoneNumber', 'phone']]
        },
        {
          model: Category,
          attributes: ['CategoryID', ['CategoryName', 'CategoryName']]
        },
        {
          model: Location,
          attributes: ['state', 'district', 'mandal', 'village']
        },
        {
          model: (await import('../models/SubCategory.js')).default,
          attributes: ['SubCategoryID', 'SubCategoryName']
        },
        {
          model: ListingImage,
          attributes: ['ImageID', 'ImageURL', 'Ordinal']
        }
      ]
    });
    // Add computed availability field (yes/no) based on IsActive
    const listingsWithAvailability = listings.map(listing => {
      const obj = listing.toJSON();
      obj.availability = obj.IsActive ? 'yes' : 'no';
      return obj;
    });
    res.json(listingsWithAvailability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getListing = async (req, res) => {
  try {
    const ListingImage = (await import('../models/ListingImage.js')).default;
    const listing = await Listing.findByPk(req.params.id, {
      attributes: [
        'ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsPriceNegotiable', 'IsActive', 'IsSeller', 'IsIndividual', 'CreateDate', 'LocationID', 'ImageURL'
      ],
      include: [
        {
          model: User,
          attributes: [['Username', 'name'], 'Email', ['PhoneNumber', 'phone']]
        },
        {
          model: Category,
          attributes: [['CategoryName', 'CategoryName']]
        },
        {
          model: Location,
          attributes: ['village']
        },
        {
          model: (await import('../models/SubCategory.js')).default,
          attributes: ['SubCategoryID', 'SubCategoryName']
        },
        {
          model: ListingImage,
          attributes: ['ImageID', 'ImageURL', 'Ordinal']
        }
      ]
    });
    if (!listing) return res.status(404).json({ error: 'Not found' });
    // Add computed availability field (yes/no) based on IsActive
    if (listing) {
      const obj = listing.toJSON();
      obj.availability = obj.IsActive ? 'yes' : 'no';
      res.json(obj);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const {
      UserID,
      CategoryID,
      Title,
      Description,
      ExpectedPrice,
      IsPriceNegotiable,
      IsActive,
      IsSeller,
      IsIndividual,
      LocationID,
      SubCategoryID
    } = req.body;

    // Create the listing record
    const newListing = await Listing.create({
      UserID,
      CategoryID,
      Title,
      Description,
      ExpectedPrice,
      IsPriceNegotiable,
      IsActive,
      IsSeller,
      IsIndividual,
      LocationID,
      SubCategoryID
    });

    // Save image records associated with the listing
    if (req.files && req.files.length > 0) {
      const imageRecords = req.files.map((file, idx) => ({
        ListingID: newListing.ListingID,
        ImageURL: `/uploads/${file.filename}`,
        Ordinal: idx + 1
      }));
      await ListingImage.bulkCreate(imageRecords);
    }

    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const updated = await Listing.update(req.body, { where: { ListingID: req.params.id }, returning: true });
    res.json(updated[1][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    await Listing.destroy({ where: { ListingID: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserListings = async (req, res) => {
  try {
    const { userId } = req.params;
    const ListingImage = (await import('../models/ListingImage.js')).default;
    const listings = await Listing.findAll({
      where: { UserID: userId },
      attributes: [
        'ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsPriceNegotiable', 'IsActive', 'IsSeller', 'IsIndividual', 'CreateDate', 'LocationID', 'CategoryID', 'ImageURL'
      ],
      include: [
        {
          model: User,
          attributes: [['Username', 'name'], 'Email', ['PhoneNumber', 'phone']]
        },
        {
          model: Category,
          attributes: ['CategoryID', ['CategoryName', 'CategoryName']]
        },
        {
          model: Location,
          attributes: ['state', 'district', 'mandal', 'village']
        },
        {
          model: (await import('../models/SubCategory.js')).default,
          attributes: ['SubCategoryID', 'SubCategoryName']
        },
        {
          model: ListingImage,
          attributes: ['ImageID', 'ImageURL', 'Ordinal']
        }
      ]
    });
    const listingsWithAvailability = listings.map(listing => {
      const obj = listing.toJSON();
      obj.availability = obj.IsActive ? 'yes' : 'no';
      return obj;
    });
    res.json(listingsWithAvailability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
