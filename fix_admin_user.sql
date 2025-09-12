-- Fix the admin user record
-- This script updates the admin user to have the correct name

-- First, let's see what users exist with admin@brighterfuture.edu
SELECT id, first_name, last_name, email, role, status 
FROM users 
WHERE email = 'admin@brighterfuture.edu';

-- Update the admin user to have a proper admin name
UPDATE users 
SET 
  first_name = 'Admin',
  last_name = 'User',
  role = 'administrator',
  department = 'Administration',
  status = 'active',
  permissions = ARRAY['students', 'calendar', 'forms', 'notes', 'attendance', 'reports', 'settings', 'programs']
WHERE email = 'admin@brighterfuture.edu';

-- Verify the update
SELECT id, first_name, last_name, email, role, status 
FROM users 
WHERE email = 'admin@brighterfuture.edu';

-- If you want to create a new admin user instead, you can run this:
/*
INSERT INTO users (first_name, last_name, email, phone, role, department, status, permissions) 
VALUES 
('Admin', 'User', 'admin@brighterfuture.edu', '(555) 000-0000', 'administrator', 'Administration', 'active', 
 ARRAY['students', 'calendar', 'forms', 'notes', 'attendance', 'reports', 'settings', 'programs'])
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions;
*/
