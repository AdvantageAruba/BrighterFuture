-- Create user profile for admin@brighterfuture.edu
-- This matches the email from your console logs

INSERT INTO users (first_name, last_name, email, phone, role, department, status, permissions) VALUES
('Dr. Sarah', 'Johnson', 'admin@brighterfuture.edu', '(555) 123-4567', 'administrator', 'Administration', 'active', ARRAY['all'])
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- Verify the user was created
SELECT * FROM users WHERE email = 'admin@brighterfuture.edu';
