-- Comprehensive fix for events author names
-- This script updates events to use proper names from the users table

-- First, let's see what we're working with
SELECT 'Before Update - Events with email addresses as author names:' as status;
SELECT id, title, author_name, created_at 
FROM events 
WHERE author_name LIKE '%@%'
ORDER BY created_at DESC;

-- Update events to use proper names from users table
-- This joins with the users table to get the proper names
UPDATE events 
SET author_name = CONCAT(u.first_name, ' ', u.last_name)
FROM users u
WHERE events.author_name = u.email
AND events.author_name LIKE '%@%';

-- Alternative approach: Update based on common patterns if the above doesn't work
-- This handles cases where the email might not exactly match
UPDATE events 
SET author_name = CASE 
  WHEN author_name = 'sarah.johnson@brighterfuture.edu' THEN 'Dr. Sarah Johnson'
  WHEN author_name = 'emily.smith@brighterfuture.edu' THEN 'Ms. Emily Smith'
  WHEN author_name = 'michael.wilson@brighterfuture.edu' THEN 'Dr. Michael Wilson'
  WHEN author_name = 'lisa.brown@brighterfuture.edu' THEN 'Ms. Lisa Brown'
  WHEN author_name = 'sarah.johnson@brighterfuture.com' THEN 'Dr. Sarah Johnson'
  WHEN author_name = 'michael.chen@brighterfuture.com' THEN 'Michael Chen'
  WHEN author_name = 'emily.rodriguez@brighterfuture.com' THEN 'Emily Rodriguez'
  WHEN author_name = 'david.thompson@brighterfuture.com' THEN 'David Thompson'
  WHEN author_name = 'lisa.williams@brighterfuture.com' THEN 'Lisa Williams'
  WHEN author_name = 'jennifer.davis@brighterfuture.com' THEN 'Jennifer Davis'
  ELSE author_name
END
WHERE author_name LIKE '%@%'
AND author_name NOT IN (
  SELECT CONCAT(first_name, ' ', last_name) 
  FROM users 
  WHERE email = events.author_name
);

-- Show results after update
SELECT 'After Update - Remaining events with email addresses:' as status;
SELECT id, title, author_name, created_at 
FROM events 
WHERE author_name LIKE '%@%'
ORDER BY created_at DESC;

-- Show all recent events to verify the fix
SELECT 'Recent Events with Author Names:' as status;
SELECT id, title, author_name, created_at 
FROM events 
ORDER BY created_at DESC 
LIMIT 15;
