-- Step 1: Create teachers table (no dependencies)
-- Run this script first

CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  specialization VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);

-- Add comments for documentation
COMMENT ON TABLE teachers IS 'Stores information about teachers and staff members';

-- Insert sample teachers
INSERT INTO teachers (name, email, phone, specialization, status) VALUES
  ('Ms. Emily Smith', 'emily.smith@brighterfuture.com', '+297-555-0101', 'Early Childhood Education', 'active'),
  ('Dr. Michael Wilson', 'michael.wilson@brighterfuture.com', '+297-555-0102', 'Speech Therapy', 'active'),
  ('Ms. Lisa Brown', 'lisa.brown@brighterfuture.com', '+297-555-0103', 'Special Education', 'active'),
  ('Dr. Sarah Johnson', 'sarah.johnson@brighterfuture.com', '+297-555-0104', 'Behavioral Therapy', 'active'),
  ('Ms. Jennifer Davis', 'jennifer.davis@brighterfuture.com', '+297-555-0105', 'Occupational Therapy', 'active')
ON CONFLICT DO NOTHING;

-- Verify teachers table was created
SELECT 'Teachers table created successfully' as status, COUNT(*) as teacher_count FROM teachers;
