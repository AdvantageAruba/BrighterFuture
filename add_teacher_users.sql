-- Add sample teacher users to the users table
-- This script will create users with teacher roles

INSERT INTO users (first_name, last_name, email, role, status, created_at, updated_at) 
VALUES 
  ('Sarah', 'Johnson', 'sarah.johnson@brighterfuture.com', 'teacher', 'active', NOW(), NOW()),
  ('Michael', 'Chen', 'michael.chen@brighterfuture.com', 'teacher', 'active', NOW(), NOW()),
  ('Emily', 'Rodriguez', 'emily.rodriguez@brighterfuture.com', 'teacher', 'active', NOW(), NOW()),
  ('David', 'Thompson', 'david.thompson@brighterfuture.com', 'teacher', 'active', NOW(), NOW()),
  ('Lisa', 'Williams', 'lisa.williams@brighterfuture.com', 'teacher', 'active', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify the teachers were added
SELECT id, first_name, last_name, email, role, status 
FROM users 
WHERE role = 'teacher' 
ORDER BY first_name;
