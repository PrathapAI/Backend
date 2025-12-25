-- PostgreSQL Migration Script for Expert System
-- Add Expert and ExpertBid tables to Campaign-Star database

-- Create ENUM types for PostgreSQL
CREATE TYPE expertise_area_enum AS ENUM ('Real Estate', 'Marriage Bureau', 'Job Assistance');
CREATE TYPE bid_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn', 'completed');

-- Create Experts table
CREATE TABLE IF NOT EXISTS "Experts" (
  "ExpertID" SERIAL PRIMARY KEY,
  "Username" VARCHAR(50) UNIQUE NOT NULL,
  "Email" VARCHAR(100) UNIQUE NOT NULL,
  "Password" TEXT NOT NULL,
  "FirstName" VARCHAR(50) NOT NULL,
  "LastName" VARCHAR(50) NOT NULL,
  "PhoneNumber" VARCHAR(20) NOT NULL,
  "ExpertiseArea" expertise_area_enum NOT NULL,
  "LocationID" INTEGER NOT NULL,
  "ServiceAreas" JSONB DEFAULT NULL,
  "YearsOfExperience" INTEGER DEFAULT NULL,
  "Certifications" TEXT DEFAULT NULL,
  "Bio" TEXT DEFAULT NULL,
  "CommissionRate" DECIMAL(5, 2) DEFAULT NULL,
  "MinimumBidAmount" DECIMAL(12, 2) DEFAULT NULL,
  "ProfileImageURL" TEXT DEFAULT NULL,
  "IsVerified" BOOLEAN DEFAULT FALSE,
  "IsActive" BOOLEAN DEFAULT TRUE,
  "SuccessfulSales" INTEGER DEFAULT 0,
  "TotalBids" INTEGER DEFAULT 0,
  "Rating" DECIMAL(3, 2) DEFAULT 0.00,
  "DateRegistered" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "LastLogin" TIMESTAMP DEFAULT NULL,
  "EmailNotifications" BOOLEAN DEFAULT TRUE,
  "SMSNotifications" BOOLEAN DEFAULT FALSE,
  "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_expert_location FOREIGN KEY ("LocationID") REFERENCES locations("LocationID") ON DELETE RESTRICT
);

-- Create ExpertBids table
CREATE TABLE IF NOT EXISTS "ExpertBids" (
  "BidID" SERIAL PRIMARY KEY,
  "ListingID" INTEGER NOT NULL,
  "ExpertID" INTEGER NOT NULL,
  "BidAmount" DECIMAL(12, 2) NOT NULL,
  "CommissionPercentage" DECIMAL(5, 2) DEFAULT NULL,
  "Proposal" TEXT NOT NULL,
  "EstimatedCompletionDays" INTEGER DEFAULT NULL,
  "Status" bid_status_enum DEFAULT 'pending',
  "ReviewedBy" INTEGER DEFAULT NULL,
  "ReviewedAt" TIMESTAMP DEFAULT NULL,
  "ReviewNotes" TEXT DEFAULT NULL,
  "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "CompletedAt" TIMESTAMP DEFAULT NULL,
  "SaleAmount" DECIMAL(12, 2) DEFAULT NULL,
  CONSTRAINT fk_bid_listing FOREIGN KEY ("ListingID") REFERENCES "Listings"("ListingID") ON DELETE CASCADE,
  CONSTRAINT fk_bid_expert FOREIGN KEY ("ExpertID") REFERENCES "Experts"("ExpertID") ON DELETE CASCADE,
  CONSTRAINT fk_bid_reviewer FOREIGN KEY ("ReviewedBy") REFERENCES "Users"("UserID") ON DELETE SET NULL
);

-- Add comment descriptions
COMMENT ON COLUMN "Experts"."ServiceAreas" IS 'Array of LocationIDs where expert provides services';
COMMENT ON COLUMN "Experts"."CommissionRate" IS 'Commission percentage expert charges';
COMMENT ON COLUMN "ExpertBids"."BidAmount" IS 'Amount expert is willing to charge for their service';
COMMENT ON COLUMN "ExpertBids"."CommissionPercentage" IS 'Commission percentage if applicable';
COMMENT ON COLUMN "ExpertBids"."Proposal" IS 'Expert proposal on how they will sell the product/service';
COMMENT ON COLUMN "ExpertBids"."EstimatedCompletionDays" IS 'Estimated days to complete the sale';
COMMENT ON COLUMN "ExpertBids"."SaleAmount" IS 'Actual sale amount if completed';

-- Create indexes for better performance
CREATE INDEX idx_expert_expertise ON "Experts"("ExpertiseArea");
CREATE INDEX idx_expert_location ON "Experts"("LocationID");
CREATE INDEX idx_expert_active ON "Experts"("IsActive", "IsVerified");
CREATE INDEX idx_bid_listing ON "ExpertBids"("ListingID");
CREATE INDEX idx_bid_expert ON "ExpertBids"("ExpertID");
CREATE INDEX idx_bid_status ON "ExpertBids"("Status");

-- Create function to update UpdatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating UpdatedAt
CREATE TRIGGER update_experts_updated_at BEFORE UPDATE ON "Experts"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expert_bids_updated_at BEFORE UPDATE ON "ExpertBids"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update Categories table to only include the three required categories
-- Note: This will remove other categories. Backup data before running in production!
DELETE FROM "Categories" WHERE "CategoryName" NOT IN ('Real Estate', 'Marriage Bureau', 'Job Assistance');

-- Insert the three required categories if they don't exist
INSERT INTO "Categories" ("CategoryName", "MaximumImagesAllowed", "PostValidityIntervalInDays")
SELECT 'Real Estate', 10, 30
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "CategoryName" = 'Real Estate');

INSERT INTO "Categories" ("CategoryName", "MaximumImagesAllowed", "PostValidityIntervalInDays")
SELECT 'Marriage Bureau', 5, 60
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "CategoryName" = 'Marriage Bureau');

INSERT INTO "Categories" ("CategoryName", "MaximumImagesAllowed", "PostValidityIntervalInDays")
SELECT 'Job Assistance', 3, 30
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "CategoryName" = 'Job Assistance');

-- Add ExpertID to Listings table to track which expert is handling the listing
ALTER TABLE "Listings"
ADD COLUMN IF NOT EXISTS "ExpertID" INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS "ExpertAssignedAt" TIMESTAMP DEFAULT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_listing_expert'
    ) THEN
        ALTER TABLE "Listings"
        ADD CONSTRAINT fk_listing_expert 
        FOREIGN KEY ("ExpertID") REFERENCES "Experts"("ExpertID") ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for expert assignments
CREATE INDEX IF NOT EXISTS idx_listing_expert ON "Listings"("ExpertID");

-- Grant permissions (adjust as needed for your user)
-- GRANT ALL PRIVILEGES ON "Experts" TO your_user;
-- GRANT ALL PRIVILEGES ON "ExpertBids" TO your_user;
-- GRANT USAGE, SELECT ON SEQUENCE "Experts_ExpertID_seq" TO your_user;
-- GRANT USAGE, SELECT ON SEQUENCE "ExpertBids_BidID_seq" TO your_user;
