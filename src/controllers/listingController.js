import Listing from '../models/Listing.js';
import ListingImage from '../models/ListingImage.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';
import { v2 as cloudinary } from 'cloudinary';

export const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      attributes: [
        'ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsPriceNegotiable', 'IsActive', 'IsSeller', 'IsIndividual', 'CreateDate', 'LocationID', 'CategoryID', 'ImageURL', 'Listing_Type', 'CampaignStartDate', 'CampaignEndDate'
      ],
      include: [
        {
          model: User,
          attributes: ['UserID', ['Username', 'name'], 'Email', ['PhoneNumber', 'phone']]
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
          as: 'ListingImages',
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
    const listing = await Listing.findOne({
      where: { ListingID: req.params.id },
      attributes: [
        'ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsPriceNegotiable', 'IsActive', 'IsSeller', 'IsIndividual', 'CreateDate', 'LocationID', 'CategoryID', 'ImageURL', 'Listing_Type', 'CampaignStartDate', 'CampaignEndDate'
      ],
      include: [
        {
          model: User,
          attributes: ['UserID', ['Username', 'name'], 'Email', ['PhoneNumber', 'phone']]
        },
        {
          model: Category,
          attributes: [['CategoryName', 'CategoryName']]
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
          as: 'ListingImages',
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
    console.log('\n========== CREATE LISTING CALLED ==========');
    console.log('Full Request body:', JSON.stringify(req.body, null, 2));
    console.log('req.body.ImageURLs directly:', req.body.ImageURLs);
    console.log('Type of req.body.ImageURLs:', typeof req.body.ImageURLs);
    console.log('Is Array:', Array.isArray(req.body.ImageURLs));
    if (Array.isArray(req.body.ImageURLs)) {
      console.log('Array length:', req.body.ImageURLs.length);
      console.log('Array contents:', req.body.ImageURLs);
    }
    
    const {
      UserID,
      CategoryID,
      SubCategoryID,
      Listing_Type,
      Title,
      Description,
      ExpectedPrice,
      IsPriceNegotiable,
      IsActive,
      IsSeller,
      IsIndividual,
      LocationID,
      CampaignStartDate,
      CampaignEndDate,
      ImageURLs // new: array of Cloudinary URLs
    } = req.body;
    console.log('Extracted ImageURLs:', ImageURLs);
    console.log('ImageURLs type:', typeof ImageURLs);
    console.log('ImageURLs isArray:', Array.isArray(ImageURLs));

    // Create the listing record first
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
      SubCategoryID,
      Listing_Type,
      CampaignStartDate: CampaignStartDate || null,
      CampaignEndDate: CampaignEndDate || null
    });

    // Accept both single image and multiple images
    let normalizedImageURLs = [];
    console.log('\n--- NORMALIZING IMAGE URLs ---');
    console.log('Raw ImageURLs:', ImageURLs);
    
    if (Array.isArray(ImageURLs)) {
      console.log('ImageURLs is an array with length:', ImageURLs.length);
      normalizedImageURLs = ImageURLs.filter(url => typeof url === 'string' && url.trim() !== '');
      console.log('After filtering, normalizedImageURLs length:', normalizedImageURLs.length);
    } else if (typeof ImageURLs === 'string' && ImageURLs.trim() !== '') {
      console.log('ImageURLs is a non-empty string');
      normalizedImageURLs = [ImageURLs];
    } else {
      console.log('ImageURLs is undefined, null, or empty');
    }
    
    console.log('Final normalizedImageURLs:', normalizedImageURLs);
    console.log('Number of images to insert:', normalizedImageURLs.length);
    
    if (normalizedImageURLs.length === 0) {
      console.warn('⚠️ NO VALID IMAGE URLs PROVIDED FOR LISTING:', newListing.ListingID);
    } else {
      console.log(`\n--- INSERTING ${normalizedImageURLs.length} IMAGES INTO ListingImages TABLE ---`);
    }
    
    // Insert each image into ListingImages table
    try {
      for (let idx = 0; idx < normalizedImageURLs.length; idx++) {
        const url = normalizedImageURLs[idx];
        console.log(`\n[Image ${idx + 1}/${normalizedImageURLs.length}]`);
        console.log('  ListingID:', newListing.ListingID);
        console.log('  ImageURL:', url);
        console.log('  Ordinal:', idx + 1);
        
        const imageRecord = await ListingImage.create({
          ListingID: newListing.ListingID,
          ImageURL: url,
          Ordinal: idx + 1
        });
        
        console.log('  ✅ Successfully inserted:', imageRecord.toJSON());
      }
      console.log(`\n✅ TOTAL IMAGES INSERTED: ${normalizedImageURLs.length}`);
    } catch (err) {
      console.error('\n❌ ERROR INSERTING ListingImages:');
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      console.error('Full error:', err);
    }
    // Fallback: handle req.files for legacy support
    if (req.files && req.files.length > 0) {
      const imageRecords = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'classified_uploads' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageRecords.push({
          ListingID: newListing.ListingID,
          ImageURL: result.secure_url,
          Ordinal: i + 1
        });
      }
      await ListingImage.bulkCreate(imageRecords);
    }

    // Fetch the listing with all associations after creation
    const listingWithImages = await Listing.findOne({
      where: { ListingID: newListing.ListingID },
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
          as: 'ListingImages',
          attributes: ['ImageID', 'ImageURL', 'Ordinal']
        }
      ]
    });
    // Add computed availability field (yes/no) based on IsActive
    if (listingWithImages) {
      const obj = listingWithImages.toJSON();
      obj.availability = obj.IsActive ? 'yes' : 'no';
      res.status(201).json(obj);
    } else {
      // This case might not be hit if findOne throws an error for not found
      res.status(404).json({ message: 'Listing not found after creation' });
    }
  } catch (err) {
    console.error('Error in createListing:', err);
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
    const listings = await Listing.findAll({
      where: { UserID: userId },
      attributes: [
        'ListingID', 'Title', 'Description', 'ExpectedPrice', 'IsPriceNegotiable', 'IsActive', 'IsSeller', 'IsIndividual', 'CreateDate', 'LocationID', 'CategoryID', 'ImageURL', 'Listing_Type', 'CampaignStartDate', 'CampaignEndDate'
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
          as: 'ListingImages',
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
