-- Check all users in the database
-- This script will help us see what users exist and identify the issue

-- Show all users
SELECT 
  id, 
  first_name, 
  last_name, 
  email, 
  role, 
  status, 
  password_changed,
  temporary_password,
  invitation_token,
  created_at
FROM users 
ORDER BY created_at DESC;

-- Check specifically for teacher@test.com
SELECT 
  id, 
  first_name, 
  last_name, 
  email, 
  role, 
  status, 
  password_changed,
  temporary_password,
  invitation_token,
  created_at
FROM users 
WHERE email = 'teacher@test.com';

-- Check for any users with "teacher" in the email
SELECT 
  id, 
  first_name, 
  last_name, 
  email, 
  role, 
  status, 
  password_changed,
  temporary_password,
  invitation_token,
  created_at
FROM users 
WHERE email LIKE '%teacher%';

-- Check for any users with "test" in the email
SELECT 
  id, 
  first_name, 
  last_name, 
  email, 
  role, 
  status, 
  password_changed,
  temporary_password,
  invitation_token,
  created_at
FROM users 
WHERE email LIKE '%test%';
