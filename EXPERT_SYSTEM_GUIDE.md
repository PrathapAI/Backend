# Expert System Implementation Guide

## Overview
The Campaign-Star app has been enhanced with an expert system that allows professionals to help users sell their Real Estate, find matches through Marriage Bureau, or secure Job Assistance. This document explains the complete implementation.

## Key Features

### 1. Expert Registration & Authentication
- Experts can register with their expertise area (Real Estate, Marriage Bureau, or Job Assistance)
- Location-based service areas
- Profile management with certifications, experience, and bio
- Separate authentication system for experts

### 2. Bidding System
- Experts can view available listings in their service areas
- Place bids with service fees and proposals
- Users can accept or reject expert bids
- Only one expert can be assigned per listing

### 3. Notification System
- Experts are automatically notified when new listings are posted in their service area
- Users are notified when experts place bids
- Notifications when bids are accepted/rejected

### 4. Category Restrictions
The app now supports only three categories:
- **Real Estate**: Property sales and rentals
- **Marriage Bureau**: Matchmaking services
- **Job Assistance**: Job placement and career services

## Database Changes

### New Tables

#### Experts Table
```sql
- ExpertID (Primary Key)
- Username, Email, Password
- FirstName, LastName, PhoneNumber
- ExpertiseArea (ENUM: Real Estate, Marriage Bureau, Job Assistance)
- LocationID (Foreign Key to locations)
- ServiceAreas (JSON array of location IDs)
- YearsOfExperience, Certifications, Bio
- CommissionRate, MinimumBidAmount
- ProfileImageURL
- IsVerified, IsActive
- SuccessfulSales, TotalBids, Rating
- DateRegistered, LastLogin
- EmailNotifications, SMSNotifications
```

#### ExpertBids Table
```sql
- BidID (Primary Key)
- ListingID (Foreign Key to Listings)
- ExpertID (Foreign Key to Experts)
- BidAmount (Expert's service fee)
- CommissionPercentage
- Proposal (How expert will help)
- EstimatedCompletionDays
- Status (pending, accepted, rejected, withdrawn, completed)
- ReviewedBy (UserID who reviewed the bid)
- ReviewedAt, ReviewNotes
- CreatedAt, UpdatedAt, CompletedAt
- SaleAmount (Final sale amount if completed)
```

#### Modified Listings Table
```sql
Added:
- ExpertID (Foreign Key to Experts)
- ExpertAssignedAt (DATETIME)
```

### Migration Script
Run the SQL migration script located at:
`src/migrations/add-expert-system.sql`

```bash
# Connect to your database and run:
mysql -u your_username -p your_database < src/migrations/add-expert-system.sql
```

## Backend Implementation

### New Models
1. **Expert.js** - Expert user model with authentication
2. **ExpertBid.js** - Bid management model

### New Controller
**expertController.js** - Contains all expert-related endpoints:
- `registerExpert` - Expert registration
- `loginExpert` - Expert authentication
- `getExpertProfile` - Get expert profile
- `updateExpertProfile` - Update expert details
- `getAvailableListings` - Get listings expert can bid on
- `placeBid` - Submit a bid on a listing
- `getExpertBids` - Get expert's bid history
- `withdrawBid` - Withdraw a pending bid
- `getListingBids` - Get all bids for a listing (for users)
- `acceptBid` - Accept an expert's bid (for users)
- `rejectBid` - Reject an expert's bid (for users)
- `getAllExperts` - Public list of experts

### New Middleware
**expertAuth.js** - JWT authentication for expert routes

### New Routes
**expertRoutes.js** - All expert-related endpoints:
```
POST   /api/experts/register              - Register new expert
POST   /api/experts/login                 - Expert login
GET    /api/experts/all                   - Get all experts (public)
GET    /api/experts/profile               - Get expert profile (protected)
PUT    /api/experts/profile               - Update expert profile (protected)
GET    /api/experts/listings/available    - Get available listings (protected)
POST   /api/experts/bids                  - Place a bid (protected)
GET    /api/experts/bids                  - Get expert's bids (protected)
PUT    /api/experts/bids/:bidId/withdraw  - Withdraw bid (protected)
GET    /api/experts/listings/:listingId/bids - Get bids for listing (user auth)
PUT    /api/experts/bids/:bidId/accept    - Accept bid (user auth)
PUT    /api/experts/bids/:bidId/reject    - Reject bid (user auth)
```

### Updated Files
1. **associations.js** - Added expert-related associations
2. **listingController.js** - Added expert notification on listing creation
3. **app.js** - Added expert routes

## Frontend Implementation

### New Pages

#### 1. ExpertRegister.jsx
Location: `frontend/src/pages/ExpertRegister.jsx`
- Expert registration form
- Validates all required fields
- Stores expert token separately from user token

#### 2. ExpertLogin.jsx
Location: `frontend/src/pages/ExpertLogin.jsx`
- Expert authentication
- Redirects to expert dashboard on success

#### 3. ExpertDashboard.jsx
Location: `frontend/src/pages/ExpertDashboard.jsx`
Features:
- View expert statistics (rating, successful sales, active bids)
- Browse available listings in service area
- Place bids with proposal and pricing
- View and manage submitted bids
- Withdraw pending bids

#### 4. ListingBids.jsx
Location: `frontend/src/pages/ListingBids.jsx`
For listing owners to:
- View all bids received on their listing
- See expert profiles and proposals
- Accept or reject bids
- Provide feedback when rejecting

### Updated Files
1. **App.jsx** - Added expert routes:
   - `/expert/register` - Expert registration
   - `/expert/login` - Expert login
   - `/expert/dashboard` - Expert dashboard
   - `/listing/:listingId/bids` - View bids on listing

## Usage Guide

### For Experts

#### Registration
1. Navigate to `/expert/register`
2. Fill in all required information:
   - Personal details (name, email, phone)
   - Expertise area (Real Estate, Marriage Bureau, or Job Assistance)
   - Location and service areas
   - Experience and certifications
   - Commission rate and minimum bid amount
3. Submit to create expert account

#### Placing Bids
1. Login at `/expert/login`
2. View available listings in dashboard
3. Click "Place Bid" on any listing
4. Enter:
   - Your service fee (bid amount)
   - Optional commission percentage
   - Detailed proposal explaining how you'll help
   - Estimated completion time
5. Submit bid

#### Managing Bids
- View all bids in "My Bids" tab
- Withdraw pending bids if needed
- Track bid status (pending, accepted, rejected)

### For Users (Listing Owners)

#### Viewing Bids
1. Go to "My Listings"
2. Click on a listing that has received bids
3. Navigate to the bids section
4. Review expert profiles and proposals

#### Accepting/Rejecting Bids
1. Review each bid carefully:
   - Expert's experience and rating
   - Proposed service fee
   - Detailed proposal
   - Estimated timeline
2. Accept the best bid - all others will be automatically rejected
3. When rejecting, optionally provide feedback

## API Examples

### Expert Registration
```javascript
POST /api/experts/register
{
  "username": "john_realtor",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "expertiseArea": "Real Estate",
  "locationID": 1,
  "yearsOfExperience": 5,
  "bio": "Experienced real estate agent...",
  "commissionRate": 2.5,
  "minimumBidAmount": 500
}
```

### Place Bid
```javascript
POST /api/experts/bids
Headers: { Authorization: "Bearer <expert_token>" }
{
  "listingId": 123,
  "bidAmount": 1000,
  "commissionPercentage": 3,
  "proposal": "I will help sell your property by...",
  "estimatedCompletionDays": 30
}
```

### Accept Bid
```javascript
PUT /api/experts/bids/:bidId/accept
Headers: { Authorization: "Bearer <user_token>" }
```

## Testing Checklist

### Backend Testing
- [ ] Expert can register successfully
- [ ] Expert can login and receive token
- [ ] Expert can view available listings in their area
- [ ] Expert can place bids on listings
- [ ] Expert cannot bid twice on same listing
- [ ] User can view bids on their listing
- [ ] User can accept bid (others get rejected)
- [ ] User can reject bid with feedback
- [ ] Expert receives notifications (console logs for now)
- [ ] Categories are limited to 3 types

### Frontend Testing
- [ ] Expert registration form works
- [ ] Expert login redirects to dashboard
- [ ] Dashboard shows correct statistics
- [ ] Available listings load correctly
- [ ] Bid modal opens and submits
- [ ] My Bids tab shows all bids
- [ ] Bid status updates correctly
- [ ] Listing owner can view bids
- [ ] Accept/Reject buttons work
- [ ] UI is responsive on mobile

## Environment Variables

Ensure these are set in your `.env` file:
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key (for email notifications)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Future Enhancements

1. **Email Notifications**: Integrate SendGrid to send actual emails to experts
2. **SMS Notifications**: Add Twilio for SMS alerts
3. **Expert Verification**: Add document upload and admin verification
4. **Rating System**: Allow users to rate experts after completion
5. **Payment Integration**: Handle payments through the platform
6. **Expert Analytics**: Detailed performance metrics
7. **Chat System**: Direct messaging between users and experts
8. **Calendar Integration**: Schedule meetings and viewings
9. **Expert Portfolio**: Upload past work and success stories
10. **Commission Tracking**: Automatic commission calculation and tracking

## Troubleshooting

### Common Issues

**Problem**: Experts not receiving notifications
- Check that listing's category matches expert's expertise area
- Verify expert has location in their service areas
- Check expert's EmailNotifications setting is true

**Problem**: Cannot place bid
- Ensure listing is active (IsActive = true)
- Verify listing doesn't already have an assigned expert
- Check expert hasn't already bid on this listing

**Problem**: Categories not restricted
- Run the migration script to update categories
- Restart the backend server
- Clear any cached category data

## Support

For issues or questions:
1. Check server logs for error messages
2. Verify database migrations ran successfully
3. Ensure all environment variables are set
4. Check frontend console for API errors

## License

This implementation is part of the Campaign-Star project.
