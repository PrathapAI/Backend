# Expert System - Deployment Checklist

## 🎯 Pre-Deployment Checklist

### Database Setup
- [ ] Backup your existing database
- [ ] Review migration script: `src/migrations/add-expert-system.sql`
- [ ] Run migration: `mysql -u root -p your_db < src/migrations/add-expert-system.sql`
- [ ] Verify migration: `mysql -u root -p your_db < src/migrations/verify-expert-system.sql`
- [ ] Check that all 3 categories exist (Real Estate, Marriage Bureau, Job Assistance)
- [ ] Verify Experts and ExpertBids tables created
- [ ] Confirm Listings table has ExpertID column

### Backend Verification
- [ ] All new model files present in `src/models/`
  - [ ] Expert.js
  - [ ] ExpertBid.js
- [ ] Controller file present: `src/controllers/expertController.js`
- [ ] Middleware file present: `src/middleware/expertAuth.js`
- [ ] Routes file present: `src/routes/expertRoutes.js`
- [ ] associations.js updated with expert relationships
- [ ] listingController.js updated with expert notifications
- [ ] Listing.js model updated with ExpertID field
- [ ] app.js includes expert routes

### Environment Variables
- [ ] DATABASE_URL is set
- [ ] JWT_SECRET is set (production-grade secret)
- [ ] SENDGRID_API_KEY set (optional, for email notifications)
- [ ] CLOUDINARY credentials set
- [ ] CORS origins include your frontend domain

### Frontend Verification
- [ ] Expert pages created in `frontend/src/pages/`
  - [ ] ExpertRegister.jsx
  - [ ] ExpertLogin.jsx
  - [ ] ExpertDashboard.jsx
  - [ ] ListingBids.jsx
- [ ] App.jsx updated with expert routes
- [ ] VITE_API_URL set correctly in frontend .env

## 🧪 Testing Checklist

### Backend API Testing

#### Expert Registration
- [ ] POST /api/experts/register works
- [ ] Returns JWT token
- [ ] Password is hashed in database
- [ ] Email validation works
- [ ] Username uniqueness enforced
- [ ] Required fields validated

#### Expert Login
- [ ] POST /api/experts/login works
- [ ] Returns token and expert data
- [ ] Invalid credentials rejected
- [ ] Inactive experts cannot login

#### Expert Protected Routes
- [ ] GET /api/experts/profile requires token
- [ ] PUT /api/experts/profile updates correctly
- [ ] GET /api/experts/listings/available shows relevant listings
- [ ] Listings filtered by location and expertise
- [ ] POST /api/experts/bids creates bid
- [ ] GET /api/experts/bids returns expert's bids
- [ ] PUT /api/experts/bids/:id/withdraw works

#### User Bid Management
- [ ] GET /api/experts/listings/:id/bids shows bids (user owns listing)
- [ ] PUT /api/experts/bids/:id/accept works
- [ ] Other bids auto-rejected when one accepted
- [ ] ExpertID assigned to listing
- [ ] PUT /api/experts/bids/:id/reject works
- [ ] Review notes saved

#### Notification System
- [ ] New listing creation logs expert notifications
- [ ] Correct experts matched (location + expertise)
- [ ] Console shows expert details

### Frontend Testing

#### Expert Registration Page
- [ ] Form loads at /expert/register
- [ ] All fields present and labeled
- [ ] Password confirmation works
- [ ] Validation errors display
- [ ] Success redirects to dashboard
- [ ] Mobile responsive

#### Expert Login Page
- [ ] Form loads at /expert/login
- [ ] Email/password fields work
- [ ] Error messages display
- [ ] Success redirects to dashboard
- [ ] Link to register works

#### Expert Dashboard
- [ ] Loads at /expert/dashboard
- [ ] Requires authentication (redirects if not logged in)
- [ ] Expert data displays correctly
- [ ] Statistics cards show data
- [ ] Available listings tab loads listings
- [ ] Bid modal opens on "Place Bid"
- [ ] Bid form submits successfully
- [ ] My Bids tab shows bid history
- [ ] Bid status colors correct
- [ ] Withdraw button works
- [ ] Logout button works

#### Listing Bids Page
- [ ] Loads at /listing/:id/bids
- [ ] Shows listing details
- [ ] Displays all bids
- [ ] Expert profiles visible
- [ ] Accept button works
- [ ] Reject modal opens
- [ ] Reject with notes works
- [ ] Status updates in real-time

### Integration Testing

#### Complete Flow Test
- [ ] User registers and logs in
- [ ] User creates Real Estate listing
- [ ] Expert registers as Real Estate expert
- [ ] Expert logs in and sees listing
- [ ] Expert places bid with proposal
- [ ] User navigates to listing bids
- [ ] User sees expert's bid
- [ ] User accepts bid
- [ ] Expert assignment shows in dashboard
- [ ] Other bids marked as rejected

#### Edge Cases
- [ ] Expert cannot bid twice on same listing
- [ ] Expert cannot bid on assigned listing
- [ ] User cannot accept bid on other user's listing
- [ ] Invalid tokens rejected
- [ ] Expired tokens handled
- [ ] Missing fields validated
- [ ] SQL injection attempts prevented

## 🔒 Security Checklist

### Authentication & Authorization
- [ ] JWT tokens properly signed
- [ ] Token expiration set (7 days)
- [ ] Passwords hashed with bcrypt
- [ ] Expert tokens separate from user tokens
- [ ] Token type validation in middleware
- [ ] Protected routes require authentication
- [ ] Authorization checks on sensitive operations

### Input Validation
- [ ] All required fields validated
- [ ] Email format validated
- [ ] Phone number format checked
- [ ] Numeric fields validated (bid amounts)
- [ ] SQL injection protection via ORM
- [ ] XSS protection in frontend

### Data Protection
- [ ] Passwords never returned in API responses
- [ ] Sensitive data excluded from public endpoints
- [ ] Database credentials in environment variables
- [ ] CORS configured for specific domains
- [ ] HTTPS enforced (production)

## 📊 Performance Checklist

### Database Optimization
- [ ] Indexes created on foreign keys
- [ ] Indexes on frequently queried fields
  - [ ] Experts.ExpertiseArea
  - [ ] Experts.LocationID
  - [ ] ExpertBids.Status
  - [ ] ExpertBids.ListingID
- [ ] Query efficiency checked (no N+1 queries)
- [ ] Database connection pooling configured

### Frontend Optimization
- [ ] Images optimized
- [ ] Code splitting (if needed)
- [ ] API calls minimized
- [ ] Loading states shown
- [ ] Error boundaries implemented

## 🌐 Deployment Checklist

### Backend Deployment
- [ ] Environment variables set on server
- [ ] Database migrations run on production DB
- [ ] Server started and running
- [ ] Health check endpoint responding
- [ ] Logs configured and accessible
- [ ] Error monitoring set up

### Frontend Deployment
- [ ] Build created: `npm run build`
- [ ] Build deployed to hosting
- [ ] API_URL points to production backend
- [ ] Static assets loading correctly
- [ ] Routes working (including expert routes)

### Domain & SSL
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] HTTPS enforced
- [ ] Backend CORS allows frontend domain

## 📝 Documentation Checklist

### Code Documentation
- [ ] Functions have comments
- [ ] Complex logic explained
- [ ] API endpoints documented
- [ ] Database schema documented

### User Documentation
- [ ] Expert registration guide
- [ ] User guide for managing bids
- [ ] FAQ created
- [ ] Support contact information

### Developer Documentation
- [ ] README updated
- [ ] API documentation created
- [ ] Setup instructions clear
- [ ] Environment variables documented

## 🚨 Monitoring Checklist

### Logging
- [ ] Server logs configured
- [ ] Error logs separate
- [ ] Log rotation set up
- [ ] Critical errors alert administrators

### Metrics
- [ ] API response times monitored
- [ ] Database query performance tracked
- [ ] User registration rate monitored
- [ ] Bid placement rate tracked

### Alerts
- [ ] Server down alerts
- [ ] Database connection failure alerts
- [ ] High error rate alerts
- [ ] Unusual activity alerts

## 🔄 Post-Deployment Checklist

### First 24 Hours
- [ ] Monitor server logs
- [ ] Check error rates
- [ ] Verify database connections stable
- [ ] Test all critical paths
- [ ] Monitor user feedback

### First Week
- [ ] Review performance metrics
- [ ] Check database growth
- [ ] Analyze user behavior
- [ ] Gather expert feedback
- [ ] Address any bugs

### First Month
- [ ] Analyze usage patterns
- [ ] Optimize slow queries
- [ ] Plan improvements
- [ ] Review security logs
- [ ] Update documentation

## ✅ Final Sign-Off

### Technical Review
- [ ] Code reviewed by team
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Backup and recovery tested
- [ ] Rollback plan prepared

### Business Review
- [ ] Features match requirements
- [ ] User experience tested
- [ ] Expert experience tested
- [ ] Pricing model confirmed
- [ ] Legal compliance verified

### Launch Approval
- [ ] Technical team approves
- [ ] Business team approves
- [ ] Security team approves
- [ ] All critical bugs fixed
- [ ] Go-live date confirmed

## 🎉 Launch Day

### Pre-Launch (2 hours before)
- [ ] Final backup taken
- [ ] Monitoring active
- [ ] Team on standby
- [ ] Communication channels ready

### Launch
- [ ] Run final migrations
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Verify all systems operational
- [ ] Announce launch

### Post-Launch (First 4 hours)
- [ ] Monitor user registrations
- [ ] Watch for errors
- [ ] Check performance metrics
- [ ] Respond to issues quickly
- [ ] Gather initial feedback

## 📞 Emergency Contacts

### Technical Issues
- Backend Lead: _____________
- Frontend Lead: _____________
- Database Admin: _____________
- DevOps: _____________

### Business Issues
- Product Manager: _____________
- Customer Support: _____________
- Legal: _____________

## 🗒️ Notes & Comments

### Installation Notes
```
Date: _______________
Installed by: _______________
Database: _______________
Server: _______________
Issues encountered: _______________
Resolution: _______________
```

### Testing Notes
```
Date: _______________
Tested by: _______________
Test environment: _______________
Issues found: _______________
All tests passed: [ ] Yes [ ] No
```

### Launch Notes
```
Launch date: _______________
Launch time: _______________
Launched by: _______________
Initial users: _______________
Initial experts: _______________
Issues: _______________
```

---

## 📚 Reference Documents

- **Setup**: EXPERT_QUICKSTART.md
- **Full Guide**: EXPERT_SYSTEM_GUIDE.md
- **Summary**: EXPERT_IMPLEMENTATION_SUMMARY.md
- **README**: EXPERT_SYSTEM_README.md
- **This Checklist**: DEPLOYMENT_CHECKLIST.md

---

**Once all items are checked, you're ready to launch! 🚀**
