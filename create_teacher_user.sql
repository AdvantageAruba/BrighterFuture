-- Create a proper teacher user with teacher@test.com
-- This script will create a user that should work with the invitation system

-- First, delete any existing user with this email (if any)
DELETE FROM users WHERE email = 'teacher@test.com';

-- Create a new teacher user
INSERT INTO users (
  first_name, 
  last_name, 
  email, 
  phone, 
  role, 
  department, 
  status, 
  permissions,
  temporary_password,
  invitation_token,
  invitation_expires,
  invitation_sent,
  password_changed
) VALUES (
  'Test', 
  'Teacher', 
  'teacher@test.com', 
  '(555) 123-4567', 
  'teacher', 
  'Education', 
  'active', 
  ARRAY['students', 'calendar', 'forms', 'notes', 'attendance'],
  'TempPass123!',  -- Temporary password
  'test_token_123',  -- Invitation token
  NOW() + INTERVAL '7 days',  -- Expires in 7 days
  false,  -- Invitation not sent yet
  false   -- Password not changed yet
);

-- Verify the user was created
SELECT 
  id, 
  first_name, 
  last_name, 
  email, 
  role, 
  status, 
  temporary_password,
  invitation_token,
  password_changed,
  created_at
FROM users 
WHERE email = 'teacher@test.com';
