-- Create users table for Brighter Future application
-- This table stores user information including profile pictures

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  picture_url TEXT,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments to document the table and fields
COMMENT ON TABLE users IS 'Stores user information for the Brighter Future application';
COMMENT ON COLUMN users.first_name IS 'User first name';
COMMENT ON COLUMN users.last_name IS 'User last name';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.phone IS 'User phone number';
COMMENT ON COLUMN users.role IS 'User role in the system';
COMMENT ON COLUMN users.department IS 'User department';
COMMENT ON COLUMN users.status IS 'User account status (active, inactive, pending)';
COMMENT ON COLUMN users.picture_url IS 'URL to the user profile picture stored in Supabase Storage';
COMMENT ON COLUMN users.permissions IS 'Array of permission strings for the user';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when user was last updated';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);

-- Insert some sample users for testing
INSERT INTO users (first_name, last_name, email, phone, role, department, status, permissions) VALUES
('Dr. Sarah', 'Johnson', 'sarah.johnson@brighterfuture.edu', '(555) 123-4567', 'administrator', 'Administration', 'active', ARRAY['students', 'calendar', 'forms', 'notes', 'attendance', 'reports', 'settings', 'programs']),
('Ms. Emily', 'Smith', 'emily.smith@brighterfuture.edu', '(555) 234-5678', 'teacher', 'Education', 'active', ARRAY['students', 'calendar', 'forms', 'notes', 'attendance']),
('Dr. Michael', 'Wilson', 'michael.wilson@brighterfuture.edu', '(555) 345-6789', 'therapist', 'Therapy Services', 'active', ARRAY['students', 'calendar', 'forms', 'notes', 'attendance']),
('Ms. Lisa', 'Brown', 'lisa.brown@brighterfuture.edu', '(555) 456-7890', 'coordinator', 'Support Services', 'active', ARRAY['students', 'calendar', 'forms', 'notes', 'attendance', 'reports', 'programs'])
ON CONFLICT (email) DO NOTHING;
