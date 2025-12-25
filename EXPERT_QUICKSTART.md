# Expert System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Database Migration
Run the migration to add expert tables:
```bash
# Navigate to your project directory
cd d:\Campaign-Star

# Run the migration (adjust credentials as needed)
mysql -u root -p campaign_star < src/migrations/add-expert-system.sql
```

### 2. Backend Setup
The backend code is already integrated! Just restart your server:
```bash
# In the project root
npm start
```

### 3. Verify Installation
Check that these endpoints are working:
- http://localhost:3000/api/experts/all (should return empty array initially)
- http://localhost:3000/ (health check)

## 📝 Test the Expert System

### Register as an Expert
```bash
curl -X POST http://localhost:3000/api/experts/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_realtor",
    "email": "jane@example.com",
    "password": "SecurePass123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "5551234567",
    "expertiseArea": "Real Estate",
    "locationID": 1,
    "yearsOfExperience": 10,
    "bio": "Experienced real estate professional with proven track record",
    "commissionRate": 2.5,
    "minimumBidAmount": 500
  }'
```

### Login as Expert
```bash
curl -X POST http://localhost:3000/api/experts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }'
```

Save the token from the response!

### View Available Listings
```bash
curl -X GET http://localhost:3000/api/experts/listings/available \
  -H "Authorization: Bearer YOUR_EXPERT_TOKEN"
```

## 🎨 Frontend Access

### Expert Pages
1. **Register**: http://localhost:5173/expert/register
2. **Login**: http://localhost:5173/expert/login
3. **Dashboard**: http://localhost:5173/expert/dashboard (after login)

### User Pages (to view bids)
1. Go to "My Listings"
2. Click on any listing
3. Click "View Bids" button (you'll need to add this to MyListings.jsx)

## 📋 Categories Update

The app now only supports these three categories:
- Real Estate
- Marriage Bureau  
- Job Assistance

The migration script automatically:
1. Removes other categories
2. Inserts the three required categories
3. Updates configuration

## 🔍 How It Works

### Flow for Real Estate Example:

1. **User Posts Listing**
   - User creates a Real Estate listing
   - System automatically notifies all Real Estate experts in that location

2. **Expert Views & Bids**
   - Expert logs in to dashboard
   - Sees the new listing in "Available Listings"
   - Places a bid with:
     - Service fee ($1000)
     - Proposal ("I will market your property through...")
     - Estimated time (30 days)

3. **User Reviews Bids**
   - User navigates to their listing
   - Views all expert bids
   - Sees expert profiles, ratings, proposals
   - Accepts the best bid

4. **Expert Assigned**
   - Accepted expert is assigned to the listing
   - Other bids are automatically rejected
   - Expert can now work on selling the property

5. **Completion**
   - When sold, expert marks as completed
   - User rates the expert
   - Expert's stats are updated

## 🎯 Key Features

### For Experts:
✅ Separate authentication system
✅ Location-based listing notifications  
✅ Professional profile with ratings
✅ Bid management (place, withdraw, track)
✅ Dashboard with statistics
✅ Service area configuration

### For Users:
✅ View all bids on their listings
✅ Expert profiles with verification badges
✅ Accept/reject bids with feedback
✅ Automatic notification of new bids
✅ Expert assignment tracking

## 📱 Mobile Support

All pages are mobile-responsive. Test on mobile by:
1. Opening Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test all flows

## 🔐 Security Features

- Separate JWT tokens for experts vs users
- Password hashing with bcrypt
- Protected routes with middleware
- Token expiration (7 days)
- Authorization checks on all sensitive operations

## 📊 Admin Features

Admins can:
- Verify experts (set IsVerified = true)
- Deactivate problematic experts
- View all bids and transactions
- Monitor expert performance
- Handle disputes

## 🛠️ Customization

### Change Commission Rates
Edit in Expert model or during registration:
```javascript
commissionRate: 2.5 // 2.5%
```

### Add More Expertise Areas
Update the ENUM in Expert.js and migration:
```javascript
ExpertiseArea: {
  type: DataTypes.ENUM('Real Estate', 'Marriage Bureau', 'Job Assistance', 'Car Sales'),
  allowNull: false
}
```

### Change Bid Statuses
Update in ExpertBid.js:
```javascript
Status: {
  type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'withdrawn', 'completed', 'in-progress'),
  defaultValue: 'pending'
}
```

## 📞 Next Steps

1. ✅ Run the migration
2. ✅ Restart backend server  
3. ✅ Test expert registration
4. ✅ Create a test listing
5. ✅ Place a test bid
6. ✅ Test bid acceptance

## 🆘 Troubleshooting

**Error: Table 'Experts' doesn't exist**
→ Run the migration script

**Error: Cannot read property 'ExpertiseArea'**
→ Restart the backend server after migration

**Frontend shows "Failed to fetch"**  
→ Check CORS settings in app.js
→ Verify API_URL in frontend .env

**Experts not notified**
→ Check console logs in backend
→ Verify location IDs match
→ Ensure expertise area matches category

## 📚 Documentation

Full documentation: `EXPERT_SYSTEM_GUIDE.md`
API endpoints: See expertRoutes.js
Database schema: See migrations/add-expert-system.sql

## 💡 Tips

- Start with testing in development
- Use Postman for API testing
- Check browser console for errors
- Monitor backend console logs
- Test with multiple expert accounts

## 🎉 You're Ready!

The expert system is now fully integrated into your Campaign-Star app. Users can list properties/jobs/matrimonial profiles, and experts can bid to help them succeed!
