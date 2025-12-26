import Expert from '../models/Expert.js';
import ExpertBid from '../models/ExpertBid.js';
import Listing from '../models/Listing.js';
import Location from '../models/Location.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Expert Registration
export const registerExpert = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      expertiseArea,
      locationID,
      serviceAreas,
      yearsOfExperience,
      certifications,
      bio,
      commissionRate,
      minimumBidAmount
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName || !phoneNumber || !expertiseArea || !locationID) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate expertise area
    const validExpertiseAreas = ['Real Estate', 'Marriage Bureau', 'Job Assistance'];
    if (!validExpertiseAreas.includes(expertiseArea)) {
      return res.status(400).json({ error: 'Invalid expertise area. Must be Real Estate, Marriage Bureau, or Job Assistance' });
    }

    // Check if email or username already exists
    const existingExpert = await Expert.findOne({
      where: {
        [Expert.sequelize.Sequelize.Op.or]: [
          { Email: email },
          { Username: username }
        ]
      }
    });

    if (existingExpert) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create expert
    const expert = await Expert.create({
      Username: username,
      Email: email,
      Password: hashedPassword,
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phoneNumber,
      ExpertiseArea: expertiseArea,
      LocationID: locationID,
      ServiceAreas: serviceAreas || [locationID],
      YearsOfExperience: yearsOfExperience || 0,
      Certifications: certifications,
      Bio: bio,
      CommissionRate: commissionRate,
      MinimumBidAmount: minimumBidAmount,
      IsActive: true,
      IsVerified: false
    });

    // Generate JWT token
    const token = jwt.sign(
      { expertId: expert.ExpertID, email: expert.Email, type: 'expert' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Expert registered successfully',
      expert: {
        expertId: expert.ExpertID,
        username: expert.Username,
        email: expert.Email,
        firstName: expert.FirstName,
        lastName: expert.LastName,
        expertiseArea: expert.ExpertiseArea,
        isVerified: expert.IsVerified
      },
      token
    });
  } catch (err) {
    console.error('Expert registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Expert Login
export const loginExpert = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if ((!email && !phoneNumber) || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required' });
    }

    // Find expert by email or phone number
    const whereClause = {};
    if (email) {
      whereClause.Email = email;
    } else if (phoneNumber) {
      whereClause.PhoneNumber = phoneNumber;
    }

    const expert = await Expert.findOne({
      where: whereClause,
      include: [{
        model: Location,
        attributes: ['state', 'district', 'mandal', 'village']
      }]
    });

    if (!expert) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if expert is active
    if (!expert.IsActive) {
      return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, expert.Password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    expert.LastLogin = new Date();
    await expert.save();

    // Generate JWT token
    const token = jwt.sign(
      { expertId: expert.ExpertID, email: expert.Email, type: 'expert' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      expert: {
        expertId: expert.ExpertID,
        username: expert.Username,
        email: expert.Email,
        firstName: expert.FirstName,
        lastName: expert.LastName,
        expertiseArea: expert.ExpertiseArea,
        location: expert.Location,
        isVerified: expert.IsVerified,
        rating: expert.Rating,
        successfulSales: expert.SuccessfulSales
      },
      token
    });
  } catch (err) {
    console.error('Expert login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Expert Profile
export const getExpertProfile = async (req, res) => {
  try {
    const expertId = req.expertId; // From auth middleware

    const expert = await Expert.findByPk(expertId, {
      include: [{
        model: Location,
        attributes: ['LocationID', 'state', 'district', 'mandal', 'village']
      }],
      attributes: { exclude: ['Password'] }
    });

    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    res.json({ expert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Expert Profile
export const updateExpertProfile = async (req, res) => {
  try {
    const expertId = req.expertId;
    const updates = req.body;

    // Don't allow updating certain fields
    delete updates.ExpertID;
    delete updates.Password;
    delete updates.Email;
    delete updates.DateRegistered;
    delete updates.SuccessfulSales;
    delete updates.TotalBids;
    delete updates.Rating;
    delete updates.IsVerified;

    const expert = await Expert.findByPk(expertId);
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    await expert.update(updates);

    res.json({
      message: 'Profile updated successfully',
      expert: { ...expert.toJSON(), Password: undefined }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Available Listings for Expert
export const getAvailableListings = async (req, res) => {
  try {
    const expertId = req.expertId;

    // Get expert details
    const expert = await Expert.findByPk(expertId);
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    // Map expertise area to category
    const categoryMap = {
      'Real Estate': 'Real Estate',
      'Marriage Bureau': 'Marriage Bureau',
      'Job Assistance': 'Job Assistance'
    };

    // Get listings in expert's expertise area and service locations
    const serviceAreas = expert.ServiceAreas || [expert.LocationID];
    
    const listings = await Listing.findAll({
      where: {
        IsActive: true,
        ExpertID: null, // Not yet assigned to an expert
        LocationID: serviceAreas
      },
      include: [
        {
          model: User,
          attributes: ['UserID', 'Username', 'Email', 'PhoneNumber']
        },
        {
          model: Location,
          attributes: ['state', 'district', 'mandal', 'village']
        },
        {
          model: ExpertBid,
          as: 'ExpertBids',
          where: { ExpertID: expertId },
          required: false
        }
      ]
    });

    res.json({ listings });
  } catch (err) {
    console.error('Get available listings error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Place a Bid on a Listing
export const placeBid = async (req, res) => {
  try {
    const expertId = req.expertId;
    const { listingId, bidAmount, commissionPercentage, proposal, estimatedCompletionDays } = req.body;

    // Validate required fields
    if (!listingId || !bidAmount || !proposal) {
      return res.status(400).json({ error: 'Listing ID, bid amount, and proposal are required' });
    }

    // Check if listing exists and is available
    const listing = await Listing.findByPk(listingId, {
      include: [{ model: User }]
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (!listing.IsActive) {
      return res.status(400).json({ error: 'Listing is not active' });
    }

    if (listing.ExpertID) {
      return res.status(400).json({ error: 'Listing already has an assigned expert' });
    }

    // Check if expert already bid on this listing
    const existingBid = await ExpertBid.findOne({
      where: {
        ListingID: listingId,
        ExpertID: expertId,
        Status: 'pending'
      }
    });

    if (existingBid) {
      return res.status(400).json({ error: 'You already have a pending bid on this listing' });
    }

    // Create the bid
    const bid = await ExpertBid.create({
      ListingID: listingId,
      ExpertID: expertId,
      BidAmount: bidAmount,
      CommissionPercentage: commissionPercentage,
      Proposal: proposal,
      EstimatedCompletionDays: estimatedCompletionDays,
      Status: 'pending'
    });

    // Update expert's total bids
    await Expert.increment('TotalBids', { where: { ExpertID: expertId } });

    // Create notification for listing owner
    await Notification.create({
      UserID: listing.UserID,
      NotificationType: 'expert_bid',
      NotificationText: `New bid received on your listing "${listing.Title}"`,
      IsRead: false
    });

    res.status(201).json({
      message: 'Bid placed successfully',
      bid
    });
  } catch (err) {
    console.error('Place bid error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Expert's Bids
export const getExpertBids = async (req, res) => {
  try {
    const expertId = req.expertId;
    const { status } = req.query;

    const whereClause = { ExpertID: expertId };
    if (status) {
      whereClause.Status = status;
    }

    const bids = await ExpertBid.findAll({
      where: whereClause,
      include: [
        {
          model: Listing,
          include: [
            { model: User, attributes: ['UserID', 'Username', 'Email', 'PhoneNumber'] },
            { model: Location, attributes: ['state', 'district', 'mandal', 'village'] }
          ]
        }
      ],
      order: [['CreatedAt', 'DESC']]
    });

    res.json({ bids });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Withdraw a Bid
export const withdrawBid = async (req, res) => {
  try {
    const expertId = req.expertId;
    const { bidId } = req.params;

    const bid = await ExpertBid.findOne({
      where: {
        BidID: bidId,
        ExpertID: expertId
      }
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (bid.Status !== 'pending') {
      return res.status(400).json({ error: 'Can only withdraw pending bids' });
    }

    bid.Status = 'withdrawn';
    await bid.save();

    res.json({ message: 'Bid withdrawn successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Bids for a Listing (for listing owner)
export const getListingBids = async (req, res) => {
  try {
    const userId = req.userId; // User must be authenticated
    const { listingId } = req.params;

    // Verify the listing belongs to the user
    const listing = await Listing.findOne({
      where: {
        ListingID: listingId,
        UserID: userId
      }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found or you do not have permission' });
    }

    const bids = await ExpertBid.findAll({
      where: { ListingID: listingId },
      include: [
        {
          model: Expert,
          attributes: { exclude: ['Password'] },
          include: [{ model: Location }]
        }
      ],
      order: [['CreatedAt', 'DESC']]
    });

    res.json({ bids });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept a Bid (for listing owner)
export const acceptBid = async (req, res) => {
  try {
    const userId = req.userId;
    const { bidId } = req.params;

    const bid = await ExpertBid.findByPk(bidId, {
      include: [{
        model: Listing,
        include: [{ model: User }]
      }]
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Verify the user owns the listing
    if (bid.Listing.UserID !== userId) {
      return res.status(403).json({ error: 'You do not have permission to accept this bid' });
    }

    if (bid.Status !== 'pending') {
      return res.status(400).json({ error: 'Bid is not in pending status' });
    }

    // Accept the bid
    bid.Status = 'accepted';
    bid.ReviewedBy = userId;
    bid.ReviewedAt = new Date();
    await bid.save();

    // Assign expert to the listing
    const listing = await Listing.findByPk(bid.ListingID);
    listing.ExpertID = bid.ExpertID;
    listing.ExpertAssignedAt = new Date();
    await listing.save();

    // Reject all other pending bids for this listing
    await ExpertBid.update(
      { Status: 'rejected', ReviewedBy: userId, ReviewedAt: new Date() },
      {
        where: {
          ListingID: bid.ListingID,
          BidID: { [ExpertBid.sequelize.Sequelize.Op.ne]: bidId },
          Status: 'pending'
        }
      }
    );

    // Notify the expert
    await Notification.create({
      UserID: bid.Listing.UserID,
      NotificationType: 'bid_accepted',
      NotificationText: `Your bid on "${listing.Title}" has been accepted!`,
      IsRead: false
    });

    res.json({ message: 'Bid accepted successfully', bid });
  } catch (err) {
    console.error('Accept bid error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Reject a Bid (for listing owner)
export const rejectBid = async (req, res) => {
  try {
    const userId = req.userId;
    const { bidId } = req.params;
    const { reviewNotes } = req.body;

    const bid = await ExpertBid.findByPk(bidId, {
      include: [{ model: Listing }]
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Verify the user owns the listing
    if (bid.Listing.UserID !== userId) {
      return res.status(403).json({ error: 'You do not have permission to reject this bid' });
    }

    if (bid.Status !== 'pending') {
      return res.status(400).json({ error: 'Bid is not in pending status' });
    }

    bid.Status = 'rejected';
    bid.ReviewedBy = userId;
    bid.ReviewedAt = new Date();
    bid.ReviewNotes = reviewNotes;
    await bid.save();

    res.json({ message: 'Bid rejected successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Experts (with filters)
export const getAllExperts = async (req, res) => {
  try {
    const { expertiseArea, locationId, minRating } = req.query;

    const whereClause = { IsActive: true };
    
    if (expertiseArea) {
      whereClause.ExpertiseArea = expertiseArea;
    }
    
    if (locationId) {
      whereClause.LocationID = locationId;
    }
    
    if (minRating) {
      whereClause.Rating = { [Expert.sequelize.Sequelize.Op.gte]: parseFloat(minRating) };
    }

    const experts = await Expert.findAll({
      where: whereClause,
      attributes: { exclude: ['Password'] },
      include: [{
        model: Location,
        attributes: ['state', 'district', 'mandal', 'village']
      }],
      order: [['Rating', 'DESC'], ['SuccessfulSales', 'DESC']]
    });

    res.json({ experts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  registerExpert,
  loginExpert,
  getExpertProfile,
  updateExpertProfile,
  getAvailableListings,
  placeBid,
  getExpertBids,
  withdrawBid,
  getListingBids,
  acceptBid,
  rejectBid,
  getAllExperts
};
