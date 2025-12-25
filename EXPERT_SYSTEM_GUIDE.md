# Expert System - User Guide

## Overview
The expert system enables professionals to bid on client listings in Real Estate, Marriage Bureau, and Job Assistance categories.

## For Experts

### Registration
1. Click "expert" button in the navbar (or "Expert Login" on mobile menu)
2. Click "Register as Expert"
3. Fill in the registration form:
   - Personal info (username, email, password, name, phone)
   - Expertise area: Real Estate, Marriage Bureau, or Job Assistance
   - Location ID (your service location)
   - Years of experience
   - Bio (describe your expertise)
   - Commission rate and minimum bid amount (optional)
4. Click "Register as Expert"

### Dashboard Features
After logging in, you'll see:
- **Stats**: Your rating, successful sales, and active bids
- **Available Listings Tab**: All listings in your location and expertise area
- **My Bids Tab**: All your placed bids with their status

### Placing Bids
1. Go to "Available Listings" tab
2. Browse listings that match your expertise
3. Click "Place Bid" on any listing
4. Fill in the bid form:
   - Bid Amount (required)
   - Commission Percentage
   - Estimated Completion Days
   - Proposal (required) - Explain how you'll help sell the listing
5. Click "Submit Bid"

### Managing Bids
- **View All Bids**: Check "My Bids" tab to see all your bids
- **Withdraw Bid**: For pending bids, click "Withdraw Bid"
- **Bid Status**:
  - PENDING: Waiting for client decision
  - ACCEPTED: Client accepted your bid
  - REJECTED: Client rejected your bid
  - WITHDRAWN: You withdrew the bid
  - COMPLETED: Service completed

## For Clients (Listing Owners)

### Viewing Bids
1. Go to "My Listings"
2. Click on a listing to view details
3. Click "View Bids" to see all expert bids

### Accepting Bids
1. Review expert profiles, ratings, and proposals
2. Compare bid amounts and timelines
3. Click "Accept Bid" on your chosen expert
4. All other bids will be automatically rejected
5. The expert will be notified

### Rejecting Bids
1. Click "Reject Bid" on unwanted bids
2. Optionally provide a reason for rejection
3. The expert will be notified with your feedback

## Expert Verification
- Verified experts have a ✓ checkmark next to their name
- Only administrators can verify experts
- Contact admin for verification requests

## Notifications
- Experts are automatically notified when:
  - A new listing is posted in their area and expertise
  - Their bid is accepted or rejected
- Clients are notified when:
  - An expert places a bid on their listing

## Styling & Responsiveness
- All expert pages use the CRED-inspired dark theme
- Fully responsive on mobile, tablet, and desktop
- Glass morphism effects and smooth animations
- Consistent with existing app design

## API Endpoints

### Expert Endpoints
- POST `/api/experts/register` - Register new expert
- POST `/api/experts/login` - Expert login
- GET `/api/experts/profile` - Get expert profile
- GET `/api/experts/listings/available` - Get available listings
- GET `/api/experts/bids` - Get expert's bids
- POST `/api/experts/bids` - Place a new bid
- PUT `/api/experts/bids/:bidId/withdraw` - Withdraw a bid

### Client Endpoints
- GET `/api/experts/listings/:listingId/bids` - Get bids for a listing
- PUT `/api/experts/bids/:bidId/accept` - Accept a bid
- PUT `/api/experts/bids/:bidId/reject` - Reject a bid

## Database Tables
- **Experts**: Expert user profiles
- **ExpertBids**: All bids placed by experts

## Support
For issues or questions:
1. Check this guide first
2. Contact system administrator
3. Report bugs through the app

---
**Last Updated**: December 2024
**Version**: 2.0.0
