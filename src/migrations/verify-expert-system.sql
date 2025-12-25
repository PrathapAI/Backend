-- Verification Script for Expert System
-- Run this after the main migration to verify everything is set up correctly

-- Check if Experts table exists
SELECT 'Experts table' AS 'Checking', 
       CASE WHEN COUNT(*) > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END AS 'Status'
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
  AND table_name = 'Experts';

-- Check if ExpertBids table exists
SELECT 'ExpertBids table' AS 'Checking',
       CASE WHEN COUNT(*) > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END AS 'Status'
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
  AND table_name = 'ExpertBids';

-- Check if Listings table has ExpertID column
SELECT 'Listings.ExpertID column' AS 'Checking',
       CASE WHEN COUNT(*) > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END AS 'Status'
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
  AND table_name = 'Listings' 
  AND column_name = 'ExpertID';

-- Check categories
SELECT 'Category Restriction' AS 'Checking',
       CONCAT(COUNT(*), ' categories found') AS 'Status',
       GROUP_CONCAT(CategoryName) AS 'Categories'
FROM Categories;

-- Verify correct categories exist
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM Categories WHERE CategoryName IN ('Real Estate', 'Marriage Bureau', 'Job Assistance')) = 3
        THEN '✓ ALL 3 REQUIRED CATEGORIES EXIST'
        ELSE '✗ MISSING REQUIRED CATEGORIES'
    END AS 'Category Check';

-- Check indexes on Experts table
SELECT 'Expert Indexes' AS 'Checking',
       COUNT(*) AS 'Count'
FROM information_schema.statistics 
WHERE table_schema = DATABASE() 
  AND table_name = 'Experts';

-- Check indexes on ExpertBids table
SELECT 'ExpertBid Indexes' AS 'Checking',
       COUNT(*) AS 'Count'
FROM information_schema.statistics 
WHERE table_schema = DATABASE() 
  AND table_name = 'ExpertBids';

-- Sample data counts
SELECT 'Current Data' AS 'Table',
       (SELECT COUNT(*) FROM Users) AS 'Users',
       (SELECT COUNT(*) FROM Experts) AS 'Experts',
       (SELECT COUNT(*) FROM Listings) AS 'Listings',
       (SELECT COUNT(*) FROM ExpertBids) AS 'Expert Bids';

-- Foreign key constraints verification
SELECT 'Foreign Keys' AS 'Checking',
       COUNT(*) AS 'Total Constraints'
FROM information_schema.table_constraints
WHERE table_schema = DATABASE()
  AND constraint_type = 'FOREIGN KEY'
  AND table_name IN ('Experts', 'ExpertBids', 'Listings');

-- Show Experts table structure
SHOW CREATE TABLE Experts;

-- Show ExpertBids table structure  
SHOW CREATE TABLE ExpertBids;

-- Show Listings table columns (to verify ExpertID added)
DESCRIBE Listings;

-- Test query: Show all experts with their locations
SELECT 
    E.ExpertID,
    E.FirstName,
    E.LastName,
    E.ExpertiseArea,
    E.IsVerified,
    L.state,
    L.district,
    L.village
FROM Experts E
LEFT JOIN locations L ON E.LocationID = L.LocationID
LIMIT 5;

-- Test query: Show all bids with expert and listing info
SELECT 
    EB.BidID,
    EB.Status,
    EB.BidAmount,
    E.FirstName AS ExpertFirstName,
    E.LastName AS ExpertLastName,
    L.Title AS ListingTitle
FROM ExpertBids EB
JOIN Experts E ON EB.ExpertID = E.ExpertID
JOIN Listings L ON EB.ListingID = L.ListingID
LIMIT 5;

-- Final summary
SELECT '✓ VERIFICATION COMPLETE' AS 'Status',
       'If all checks passed, expert system is ready!' AS 'Message';
