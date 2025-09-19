-- Simplified RLS policies for students table
-- First, disable RLS temporarily to test
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all users to read students" ON students;
DROP POLICY IF EXISTS "Allow all users to insert students" ON students;
DROP POLICY IF EXISTS "Allow all users to update students" ON students;
DROP POLICY IF EXISTS "Allow all users to delete students" ON students;

-- Re-enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create very permissive policies for testing
CREATE POLICY "Allow all authenticated users to read students" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated users to insert students" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated users to update students" ON students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated users to delete students" ON students FOR DELETE USING (auth.role() = 'authenticated');

-- Also create policies that allow service role (for admin operations)
CREATE POLICY "Allow service role full access" ON students FOR ALL USING (auth.role() = 'service_role');

-- Test the policies
SELECT 'RLS Policies created successfully' as status;

-- Verify we can read from students table
SELECT COUNT(*) as student_count FROM students;

