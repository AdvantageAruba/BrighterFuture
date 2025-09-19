-- Fix RLS policies for users table - this might be causing the timeout
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow all authenticated users to read users" ON users;
DROP POLICY IF EXISTS "Allow all authenticated users to insert users" ON users;
DROP POLICY IF EXISTS "Allow all authenticated users to update users" ON users;
DROP POLICY IF EXISTS "Allow all authenticated users to delete users" ON users;
DROP POLICY IF EXISTS "Allow all users to read users" ON users;
DROP POLICY IF EXISTS "Allow all users to insert users" ON users;
DROP POLICY IF EXISTS "Allow all users to update users" ON users;
DROP POLICY IF EXISTS "Allow all users to delete users" ON users;
DROP POLICY IF EXISTS "Allow service role full access" ON users;

-- Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies for users table
CREATE POLICY "Allow authenticated users to read users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert users" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update users" ON users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete users" ON users FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON users FOR ALL USING (auth.role() = 'service_role');

-- Test the policies
SELECT 'Users RLS Policies updated successfully' as status;

-- Verify we can read from users table
SELECT COUNT(*) as user_count FROM users;

-- Test specific user lookup
SELECT id, email, first_name, last_name, role FROM users WHERE email = 'admin@brighterfuture.edu';

