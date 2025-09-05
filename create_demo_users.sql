-- Create demo users for Brighter Future login system
-- These users will be used for testing the login functionality

-- First, let's create the auth users in Supabase Auth (this would normally be done through Supabase dashboard)
-- For now, we'll create the corresponding records in our users table

-- Insert demo users with different roles and permissions
INSERT INTO users (first_name, last_name, email, phone, role, department, status, permissions) VALUES
-- Administrator user
('Dr. Sarah', 'Johnson', 'admin@brighterfuture.edu', '(555) 123-4567', 'administrator', 'Administration', 'active', ARRAY['all']),

-- Teacher user
('John', 'Smith', 'teacher@brighterfuture.edu', '(555) 234-5678', 'teacher', 'Education', 'active', ARRAY['students', 'calendar', 'notes', 'attendance']),

-- Therapist user
('Dr. Maria', 'Garcia', 'therapist@brighterfuture.edu', '(555) 345-6789', 'therapist', 'Therapy', 'active', ARRAY['students', 'therapy', 'assessments', 'calendar', 'notes']),

-- Program Coordinator user
('Lisa', 'Brown', 'coordinator@brighterfuture.edu', '(555) 456-7890', 'coordinator', 'Program Management', 'active', ARRAY['students', 'programs', 'calendar', 'reports', 'notes']),

-- Parent user
('Michael', 'Davis', 'parent@brighterfuture.edu', '(555) 567-8901', 'parent', 'Parent', 'active', ARRAY['view_child', 'messages', 'calendar_view']),

-- Staff user
('Jennifer', 'Wilson', 'staff@brighterfuture.edu', '(555) 678-9012', 'staff', 'Administration', 'active', ARRAY['calendar_view', 'notes_view'])

ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Add comments for documentation
COMMENT ON TABLE users IS 'Stores user information for the Brighter Future application with authentication and authorization';
COMMENT ON COLUMN users.permissions IS 'Array of permission strings for role-based access control';

-- Create a view for easy user management
CREATE OR REPLACE VIEW user_summary AS
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  department,
  status,
  permissions,
  created_at,
  updated_at
FROM users
ORDER BY role, last_name, first_name;

COMMENT ON VIEW user_summary IS 'Summary view of users for administrative purposes';
