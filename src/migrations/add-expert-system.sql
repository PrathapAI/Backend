-- Migration Script for Expert System
-- Add Expert and ExpertBid tables to Campaign-Star database

-- Create Experts table
CREATE TABLE IF NOT EXISTS Experts (
  ExpertID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) UNIQUE NOT NULL,
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password TEXT NOT NULL,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  PhoneNumber VARCHAR(20) NOT NULL,
  ExpertiseArea ENUM('Real Estate', 'Marriage Bureau', 'Job Assistance') NOT NULL,
  LocationID INT NOT NULL,
  ServiceAreas JSON DEFAULT NULL COMMENT 'Array of LocationIDs where expert provides services',
  YearsOfExperience INT DEFAULT NULL,
  Certifications TEXT DEFAULT NULL,
  Bio TEXT DEFAULT NULL,
  CommissionRate DECIMAL(5, 2) DEFAULT NULL COMMENT 'Commission percentage expert charges',
  MinimumBidAmount DECIMAL(12, 2) DEFAULT NULL,
  ProfileImageURL TEXT DEFAULT NULL,
  IsVerified BOOLEAN DEFAULT FALSE,
  IsActive BOOLEAN DEFAULT TRUE,
  SuccessfulSales INT DEFAULT 0,
  TotalBids INT DEFAULT 0,
  Rating DECIMAL(3, 2) DEFAULT 0.00,
  DateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
  LastLogin DATETIME DEFAULT NULL,
  EmailNotifications BOOLEAN DEFAULT TRUE,
  SMSNotifications BOOLEAN DEFAULT FALSE,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (LocationID) REFERENCES locations(LocationID) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create ExpertBids table
CREATE TABLE IF NOT EXISTS ExpertBids (
  BidID INT AUTO_INCREMENT PRIMARY KEY,
  ListingID INT NOT NULL,
  ExpertID INT NOT NULL,
  BidAmount DECIMAL(12, 2) NOT NULL COMMENT 'Amount expert is willing to charge for their service',
  CommissionPercentage DECIMAL(5, 2) DEFAULT NULL COMMENT 'Commission percentage if applicable',
  Proposal TEXT NOT NULL COMMENT 'Expert proposal on how they will sell the product/service',
  EstimatedCompletionDays INT DEFAULT NULL COMMENT 'Estimated days to complete the sale',
  Status ENUM('pending', 'accepted', 'rejected', 'withdrawn', 'completed') DEFAULT 'pending',
  ReviewedBy INT DEFAULT NULL,
  ReviewedAt DATETIME DEFAULT NULL,
  ReviewNotes TEXT DEFAULT NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CompletedAt DATETIME DEFAULT NULL,
  SaleAmount DECIMAL(12, 2) DEFAULT NULL COMMENT 'Actual sale amount if completed',
  FOREIGN KEY (ListingID) REFERENCES Listings(ListingID) ON DELETE CASCADE,
  FOREIGN KEY (ExpertID) REFERENCES Experts(ExpertID) ON DELETE CASCADE,
  FOREIGN KEY (ReviewedBy) REFERENCES Users(UserID) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes for better performance
CREATE INDEX idx_expert_expertise ON Experts(ExpertiseArea);
CREATE INDEX idx_expert_location ON Experts(LocationID);
CREATE INDEX idx_expert_active ON Experts(IsActive, IsVerified);
CREATE INDEX idx_bid_listing ON ExpertBids(ListingID);
CREATE INDEX idx_bid_expert ON ExpertBids(ExpertID);
CREATE INDEX idx_bid_status ON ExpertBids(Status);

-- Update Categories table to only include the three required categories
-- First, backup existing data if needed, then update
-- Note: This will remove other categories. Backup data before running in production!

-- Option 1: Clear and insert only required categories
DELETE FROM Categories WHERE CategoryName NOT IN ('Real Estate', 'Marriage Bureau', 'Job Assistance');

-- Insert the three required categories if they don't exist
INSERT INTO Categories (CategoryName, MaximumImagesAllowed, PostValidityIntervalInDays)
SELECT 'Real Estate', 10, 30
WHERE NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Real Estate');

INSERT INTO Categories (CategoryName, MaximumImagesAllowed, PostValidityIntervalInDays)
SELECT 'Marriage Bureau', 5, 60
WHERE NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Marriage Bureau');

INSERT INTO Categories (CategoryName, MaximumImagesAllowed, PostValidityIntervalInDays)
SELECT 'Job Assistance', 3, 30
WHERE NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Job Assistance');

-- Add ExpertID to Listings table to track which expert is handling the listing
ALTER TABLE Listings
ADD COLUMN ExpertID INT DEFAULT NULL AFTER UserID,
ADD COLUMN ExpertAssignedAt DATETIME DEFAULT NULL,
ADD CONSTRAINT fk_listing_expert FOREIGN KEY (ExpertID) REFERENCES Experts(ExpertID) ON DELETE SET NULL;

-- Create index for expert assignments
CREATE INDEX idx_listing_expert ON Listings(ExpertID);
