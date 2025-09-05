-- Simple approach: Create auth users using Supabase Dashboard
-- The SQL method is complex and may not work due to security restrictions

-- STEP 1: Go to Supabase Dashboard
-- 1. Visit https://supabase.com/dashboard
-- 2. Select your Brighter Future project
-- 3. Go to Authentication → Users
-- 4. Click "Add user"

-- STEP 2: Create these users manually:
-- User 1: admin@brighterfuture.edu / admin123
-- User 2: teacher@brighterfuture.edu / teacher123
-- User 3: therapist@brighterfuture.edu / therapist123
-- User 4: coordinator@brighterfuture.edu / coordinator123
-- User 5: parent@brighterfuture.edu / parent123
-- User 6: staff@brighterfuture.edu / staff123

-- STEP 3: Run the demo users SQL (create_demo_users.sql) to create user profiles

-- Alternative: Use this simplified SQL to create just one test user
-- (This might work better than the complex auth.users insert)

-- First, let's create a simple test user in the users table
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

-- Then create the auth user in Supabase Dashboard with:
-- Email: test@brighterfuture.edu
-- Password: test123
