-- Check if there are any users with teacher role
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  status,
  created_at
FROM users 
WHERE role = 'teacher'
ORDER BY first_name;

-- Check total users count
SELECT 
  role,
  COUNT(*) as count
FROM users 
GROUP BY role
ORDER BY role;

-- Check if users table exists and has data
SELECT 
  COUNT(*) as total_users
FROM users;
