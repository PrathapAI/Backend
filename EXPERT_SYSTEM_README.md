# Expert System for Campaign-Star

## 🎯 Overview

The Expert System transforms Campaign-Star into a comprehensive marketplace where professionals can help users sell their Real Estate, find marriage matches, or secure jobs.

## 🚀 What It Does

### For Users
- Post listings in 3 categories: Real Estate, Marriage Bureau, Job Assistance
- Receive expert bids from qualified professionals
- Review expert profiles, ratings, and proposals
- Accept the best expert to help achieve their goals

### For Experts
- Register as a professional in their area of expertise
- Receive notifications of new listings in their service area
- Place competitive bids with detailed proposals
- Build reputation through ratings and successful completions
- Manage multiple clients through a professional dashboard

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────────▶│   Listing    │◀────────│   Expert    │
│ (Posts Need)│         │ (Real Estate)│         │ (Professional)
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Expert Bids │
                        │  (Proposals) │
                        └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │    Accept    │
                        │  Best Expert │
                        └──────────────┘
```

## 📦 Components

### Backend (Node.js + Express + Sequelize)
- **Models**: Expert, ExpertBid
- **Controllers**: expertController.js (12 endpoints)
- **Middleware**: expertAuth.js (JWT authentication)
- **Routes**: expertRoutes.js
- **Notifications**: Location-based expert matching

### Frontend (React + Vite)
- **Pages**: ExpertRegister, ExpertLogin, ExpertDashboard, ListingBids
- **Features**: Responsive design, real-time updates, modal dialogs

### Database (MySQL)
- **Tables**: Experts, ExpertBids
- **Relationships**: Many-to-many with tracking
- **Indexes**: Optimized for location and expertise queries

## 🔑 Key Features

1. **Separate Authentication**: Experts have their own login system
2. **Location Matching**: Experts only see listings in their service areas
3. **Expertise Matching**: Category → Expertise area mapping
4. **Bid Management**: Place, track, withdraw, and manage bids
5. **Smart Notifications**: Automatic alerts to relevant experts
6. **Professional Profiles**: Bio, certifications, ratings, stats
7. **Category Restriction**: Only 3 focused categories
8. **Status Tracking**: Complete lifecycle from bid to completion

## 📋 Quick Start

### 1. Database Setup
```bash
mysql -u root -p your_database < src/migrations/add-expert-system.sql
```

### 2. Verify Installation
```bash
mysql -u root -p your_database < src/migrations/verify-expert-system.sql
```

### 3. Start Backend
```bash
npm start
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Access
- **Expert Registration**: http://localhost:5173/expert/register
- **Expert Login**: http://localhost:5173/expert/login
- **Expert Dashboard**: http://localhost:5173/expert/dashboard

## 🎨 User Interface

### Expert Dashboard
```
┌─────────────────────────────────────────────────┐
│  Expert Dashboard                    [Logout]   │
├─────────────────────────────────────────────────┤
│  Welcome, John Doe - Real Estate Expert ✓       │
├─────────────────────────────────────────────────┤
│  Rating: 4.5/5  │ Sales: 15  │ Active Bids: 3   │
├─────────────────────────────────────────────────┤
│  [Available Listings] [My Bids] [Profile]       │
├─────────────────────────────────────────────────┤
│  📋 3-Bedroom House - $250,000                   │
│  📍 Downtown, City District                      │
│  [Place Bid]                                     │
├─────────────────────────────────────────────────┤
│  🏠 Commercial Property - $500,000               │
│  📍 Business District                            │
│  [Already Bid]                                   │
└─────────────────────────────────────────────────┘
```

### Listing Bids (User View)
```
┌─────────────────────────────────────────────────┐
│  Bids for: 3-Bedroom House                      │
├─────────────────────────────────────────────────┤
│  👤 Jane Smith ✓ Verified                        │
│  ⭐ 4.8/5 (23 successful sales)                  │
│  💰 $2,500 service fee + 2% commission           │
│  📝 "I will market through multiple channels..." │
│  ⏱️ Estimated: 30 days                           │
│  [Accept Bid] [Reject]                           │
├─────────────────────────────────────────────────┤
│  👤 Mike Johnson                                 │
│  ⭐ 4.2/5 (12 successful sales)                  │
│  💰 $3,000 service fee                           │
│  📝 "My professional network will help..."       │
│  [Accept Bid] [Reject]                           │
└─────────────────────────────────────────────────┘
```

## 🔌 API Reference

### Expert Endpoints
```javascript
// Register
POST /api/experts/register
Body: { username, email, password, firstName, lastName, 
        phoneNumber, expertiseArea, locationID, ... }

// Login
POST /api/experts/login
Body: { email, password }
Returns: { token, expert: {...} }

// Get Available Listings
GET /api/experts/listings/available
Headers: { Authorization: "Bearer <token>" }

// Place Bid
POST /api/experts/bids
Headers: { Authorization: "Bearer <token>" }
Body: { listingId, bidAmount, proposal, ... }
```

### User Endpoints (for managing bids)
```javascript
// Get Bids for Listing
GET /api/experts/listings/:listingId/bids
Headers: { Authorization: "Bearer <user_token>" }

// Accept Bid
PUT /api/experts/bids/:bidId/accept
Headers: { Authorization: "Bearer <user_token>" }

// Reject Bid
PUT /api/experts/bids/:bidId/reject
Headers: { Authorization: "Bearer <user_token>" }
Body: { reviewNotes: "optional feedback" }
```

## 📊 Database Schema

### Experts Table
- Primary fields: ExpertID, Username, Email, Password
- Profile: FirstName, LastName, PhoneNumber, Bio
- Expertise: ExpertiseArea (ENUM), LocationID, ServiceAreas (JSON)
- Professional: YearsOfExperience, Certifications
- Pricing: CommissionRate, MinimumBidAmount
- Status: IsVerified, IsActive
- Stats: SuccessfulSales, TotalBids, Rating

### ExpertBids Table
- Identification: BidID, ListingID, ExpertID
- Bid Details: BidAmount, CommissionPercentage, Proposal
- Timeline: EstimatedCompletionDays, CreatedAt, CompletedAt
- Status: Status (pending/accepted/rejected/withdrawn/completed)
- Review: ReviewedBy, ReviewedAt, ReviewNotes
- Performance: SaleAmount

## 🔐 Security

- JWT tokens (7-day expiration)
- bcrypt password hashing
- Separate expert authentication
- Token type validation
- Route protection middleware
- Authorization checks on sensitive operations
- SQL injection protection via Sequelize ORM

## 📈 Business Logic

### Bid Workflow
1. User creates listing → System notifies relevant experts
2. Expert views listing → Places bid with proposal
3. User reviews bids → Compares experts and proposals
4. User accepts best bid → Expert assigned, others rejected
5. Expert works on listing → Status updates
6. Completion → User rates expert → Stats updated

### Expert Matching
```javascript
// Listing → Expert matching criteria
- Category matches ExpertiseArea
- Location in expert's ServiceAreas
- Expert is active (IsActive = true)
- Expert wants notifications (EmailNotifications = true)
```

### Bid Status Flow
```
pending → accepted → completed ✓
       ↘ rejected ✗
       ↘ withdrawn
```

## 🧪 Testing

### Backend Tests
```bash
# Test expert registration
curl -X POST http://localhost:3000/api/experts/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test_expert", "email":"test@example.com", ...}'

# Test expert login
curl -X POST http://localhost:3000/api/experts/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"TestPass123!"}'
```

### Frontend Tests
1. Navigate to `/expert/register`
2. Fill form and submit
3. Login at `/expert/login`
4. View dashboard
5. Place test bid
6. Switch to user account
7. View and accept bid

## 📚 Documentation

- **Setup Guide**: EXPERT_QUICKSTART.md
- **Full Documentation**: EXPERT_SYSTEM_GUIDE.md
- **Implementation Summary**: EXPERT_IMPLEMENTATION_SUMMARY.md
- **This File**: EXPERT_SYSTEM_README.md

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL=mysql://user:pass@host:port/dbname
JWT_SECRET=your-secret-key-here
SENDGRID_API_KEY=optional-for-email-notifications
NODE_ENV=development
```

### Category Configuration
Edit in `src/migrations/add-expert-system.sql`:
```sql
-- Add/remove categories
INSERT INTO Categories (CategoryName, ...) VALUES ('New Category', ...);
```

### Expert Fields
Add custom fields in `src/models/Expert.js`:
```javascript
SpecialtyArea: {
  type: DataTypes.STRING(100),
  allowNull: true
}
```

## 🚀 Deployment

### Production Checklist
- [ ] Run database migrations
- [ ] Set production JWT_SECRET
- [ ] Configure CORS for production domain
- [ ] Set up email service (SendGrid/AWS SES)
- [ ] Enable SSL/HTTPS
- [ ] Set up monitoring (logs, errors)
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Test all workflows end-to-end
- [ ] Create admin panel for expert verification

## 🔮 Future Enhancements

### Planned Features
1. **Email Notifications**: SendGrid integration
2. **SMS Alerts**: Twilio integration
3. **Payment Processing**: Stripe/PayPal for service fees
4. **Rating System**: Detailed reviews and ratings
5. **Messaging**: In-app chat between users and experts
6. **Calendar**: Schedule viewings and meetings
7. **Analytics**: Expert performance dashboards
8. **Mobile App**: Native iOS/Android apps
9. **Video Calls**: Virtual consultations
10. **Document Management**: Contract signing and storage

### Technical Improvements
- Real-time notifications with WebSocket
- Redis for caching and session management
- Elasticsearch for advanced search
- CDN for image optimization
- Load balancing for scalability
- Automated testing suite
- CI/CD pipeline

## 💡 Use Cases

### Real Estate
- **Listing**: "3-bedroom house for sale - $250,000"
- **Expert**: Real estate agent with local knowledge
- **Bid**: "$2,500 service fee + 2% commission, 30-day listing"
- **Outcome**: Property sold, expert earns commission

### Marriage Bureau
- **Listing**: "Professional seeking life partner"
- **Expert**: Matchmaker with database and screening process
- **Bid**: "$500 service fee, 10 curated matches"
- **Outcome**: Successful match, happy couple

### Job Assistance
- **Listing**: "Software engineer seeking new role"
- **Expert**: Recruiter with company connections
- **Bid**: "$300 service fee, 5 interview opportunities"
- **Outcome**: Job placement, career growth

## 🆘 Troubleshooting

### Common Issues

**"Table Experts doesn't exist"**
→ Run the migration: `mysql ... < add-expert-system.sql`

**"Invalid token"**
→ Check token type (expert vs user)
→ Verify JWT_SECRET is set

**"No available listings"**
→ Check expert's ServiceAreas includes listing location
→ Verify expertise area matches category

**"Cannot place bid"**
→ Ensure listing doesn't have assigned expert
→ Check for existing pending bid

## 📞 Support

For issues, questions, or contributions:
1. Check documentation files
2. Review console logs (frontend & backend)
3. Verify database migration status
4. Test API endpoints with Postman
5. Check environment variables

## 📄 License

Part of the Campaign-Star project.

---

**Built with ❤️ for Campaign-Star**

*Empowering users with expert assistance in Real Estate, Marriage Bureau, and Job Assistance.*
