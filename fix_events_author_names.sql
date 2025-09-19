-- Fix events table to use proper names instead of email addresses for author_name
-- This script updates existing events that have email addresses as author names

-- Update events where author_name contains email addresses to use proper names
UPDATE events 
SET author_name = CASE 
  -- Map email addresses to proper names based on the users table
  WHEN author_name = 'sarah.johnson@brighterfuture.edu' THEN 'Dr. Sarah Johnson'
  WHEN author_name = 'emily.smith@brighterfuture.edu' THEN 'Ms. Emily Smith'
  WHEN author_name = 'michael.wilson@brighterfuture.edu' THEN 'Dr. Michael Wilson'
  WHEN author_name = 'lisa.brown@brighterfuture.edu' THEN 'Ms. Lisa Brown'
  
  -- Handle other common email patterns
  WHEN author_name LIKE '%@%' THEN 
    CASE 
      WHEN author_name = 'sarah.johnson@brighterfuture.com' THEN 'Dr. Sarah Johnson'
      WHEN author_name = 'michael.chen@brighterfuture.com' THEN 'Michael Chen'
      WHEN author_name = 'emily.rodriguez@brighterfuture.com' THEN 'Emily Rodriguez'
      WHEN author_name = 'david.thompson@brighterfuture.com' THEN 'David Thompson'
      WHEN author_name = 'lisa.williams@brighterfuture.com' THEN 'Lisa Williams'
      WHEN author_name = 'jennifer.davis@brighterfuture.com' THEN 'Jennifer Davis'
      ELSE author_name -- Keep as is if no mapping found
    END
  ELSE author_name -- Keep non-email names as is
END
WHERE author_name LIKE '%@%'; -- Only update records that contain email addresses

-- Verify the updates
SELECT id, title, author_name, created_at 
FROM events 
WHERE author_name LIKE '%@%'
ORDER BY created_at DESC;

-- Show all events with their author names to verify the fix
SELECT id, title, author_name, created_at 
FROM events 
ORDER BY created_at DESC 
LIMIT 10;
