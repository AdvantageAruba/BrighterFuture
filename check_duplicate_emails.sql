-- Check for duplicate emails in users table
SELECT email, COUNT(*) as count
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check all users with teacher role
SELECT id, first_name, last_name, email, role, status, created_at
FROM users 
WHERE role = 'teacher'
ORDER BY first_name;

-- Check if Alex Thomas already exists
SELECT id, first_name, last_name, email, role, status
FROM users 
WHERE first_name ILIKE '%alex%' 
   OR last_name ILIKE '%thomas%'
   OR email ILIKE '%alex%';
