-- Fix RLS policies for students table - handles existing policies
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow all authenticated users to read students" ON students;
DROP POLICY IF EXISTS "Allow all authenticated users to insert students" ON students;
DROP POLICY IF EXISTS "Allow all authenticated users to update students" ON students;
DROP POLICY IF EXISTS "Allow all authenticated users to delete students" ON students;
DROP POLICY IF EXISTS "Allow all users to read students" ON students;
DROP POLICY IF EXISTS "Allow all users to insert students" ON students;
DROP POLICY IF EXISTS "Allow all users to update students" ON students;
DROP POLICY IF EXISTS "Allow all users to delete students" ON students;
DROP POLICY IF EXISTS "Allow service role full access" ON students;

-- Disable RLS temporarily
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Allow authenticated users to read students" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert students" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update students" ON students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete students" ON students FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role full access" ON students FOR ALL USING (auth.role() = 'service_role');

-- Test the policies
SELECT 'RLS Policies updated successfully' as status;

-- Verify we can read from students table
SELECT COUNT(*) as student_count FROM students;

