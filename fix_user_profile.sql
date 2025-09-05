-- Quick fix: Create a user profile for the existing auth user
-- Based on the console logs, you have a valid session but no user profile

-- First, let's see what email is associated with your current session
-- You can check this in the browser console or Supabase dashboard

-- Create a default admin user profile
-- Replace 'your-email@example.com' with the actual email from your session
INSERT INTO users (first_name, last_name, email, phone, role, department, status, permissions) VALUES
('Admin', 'User', 'your-email@example.com', '(555) 000-0000', 'administrator', 'Administration', 'active', ARRAY['all'])
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Alternative: Create a generic test user
INSERT INTO users (first_name, last_name, email, phone, role, department, status, permissions) VALUES
('Test', 'User', 'test@brighterfuture.edu', '(555) 000-0000', 'administrator', 'Test', 'active', ARRAY['all'])
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();
