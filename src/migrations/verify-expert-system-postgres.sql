-- PostgreSQL Verification Script for Expert System
-- Run this after the main migration to verify everything is set up correctly

-- Check if Experts table exists
SELECT 'Experts table' AS "Checking", 
       CASE WHEN COUNT(*) > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END AS "Status"
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'Experts';

-- Check if ExpertBids table exists
SELECT 'ExpertBids table' AS "Checking",
       CASE WHEN COUNT(*) > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END AS "Status"
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'ExpertBids';

-- Check if Listings table has ExpertID column
SELECT 'Listings.ExpertID column' AS "Checking",
       CASE WHEN COUNT(*) > 0 THEN '✓ EXISTS' ELSE '✗ MISSING' END AS "Status"
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'Listings' 
  AND column_name = 'ExpertID';

-- Check ENUM types
SELECT 'ENUM Types' AS "Checking",
       COUNT(*) AS "Count",
       STRING_AGG(typname, ', ') AS "Types"
FROM pg_type 
WHERE typname IN ('expertise_area_enum', 'bid_status_enum');

-- Check categories
SELECT 'Category Restriction' AS "Checking",
       COUNT(*) || ' categories found' AS "Status",
       STRING_AGG("CategoryName", ', ') AS "Categories"
FROM "Categories";

-- Verify correct categories exist
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM "Categories" WHERE "CategoryName" IN ('Real Estate', 'Marriage Bureau', 'Job Assistance')) = 3
        THEN '✓ ALL 3 REQUIRED CATEGORIES EXIST'
        ELSE '✗ MISSING REQUIRED CATEGORIES'
    END AS "Category Check";

-- Check indexes on Experts table
SELECT 'Expert Indexes' AS "Checking",
       COUNT(*) AS "Count"
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'Experts';

-- Check indexes on ExpertBids table
SELECT 'ExpertBid Indexes' AS "Checking",
       COUNT(*) AS "Count"
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'ExpertBids';

-- Sample data counts
SELECT 'Current Data' AS "Table",
       (SELECT COUNT(*) FROM "Users") AS "Users",
       (SELECT COUNT(*) FROM "Experts") AS "Experts",
       (SELECT COUNT(*) FROM "Listings") AS "Listings",
       (SELECT COUNT(*) FROM "ExpertBids") AS "Expert Bids";

-- Foreign key constraints verification
SELECT 'Foreign Keys' AS "Checking",
       COUNT(*) AS "Total Constraints"
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND constraint_type = 'FOREIGN KEY'
  AND table_name IN ('Experts', 'ExpertBids', 'Listings');

-- List all foreign keys
SELECT 
    tc.table_name AS "Table", 
    kcu.column_name AS "Column",
    ccu.table_name AS "References Table",
    ccu.column_name AS "References Column"
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('Experts', 'ExpertBids', 'Listings')
ORDER BY tc.table_name;

-- Show Experts table structure
SELECT 
    column_name AS "Column",
    data_type AS "Type",
    character_maximum_length AS "Length",
    is_nullable AS "Nullable",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'Experts'
ORDER BY ordinal_position;

-- Show ExpertBids table structure  
SELECT 
    column_name AS "Column",
    data_type AS "Type",
    is_nullable AS "Nullable",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'ExpertBids'
ORDER BY ordinal_position;

-- Test query: Show all experts with their locations
SELECT 
    E."ExpertID",
    E."FirstName",
    E."LastName",
    E."ExpertiseArea",
    E."IsVerified",
    L.state,
    L.district,
    L.village
FROM "Experts" E
LEFT JOIN locations L ON E."LocationID" = L."LocationID"
LIMIT 5;

-- Test query: Show all bids with expert and listing info
SELECT 
    EB."BidID",
    EB."Status",
    EB."BidAmount",
    E."FirstName" AS "ExpertFirstName",
    E."LastName" AS "ExpertLastName",
    L."Title" AS "ListingTitle"
FROM "ExpertBids" EB
JOIN "Experts" E ON EB."ExpertID" = E."ExpertID"
JOIN "Listings" L ON EB."ListingID" = L."ListingID"
LIMIT 5;

-- Check triggers
SELECT 
    trigger_name AS "Trigger",
    event_manipulation AS "Event",
    event_object_table AS "Table"
FROM information_schema.triggers
WHERE event_object_table IN ('Experts', 'ExpertBids')
ORDER BY event_object_table;

-- Final summary
SELECT '✓ VERIFICATION COMPLETE' AS "Status",
       'If all checks passed, expert system is ready!' AS "Message";
