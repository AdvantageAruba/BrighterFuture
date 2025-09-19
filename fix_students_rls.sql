-- Fix RLS policies for students table
-- This script ensures that the students table has proper RLS policies

-- Check if RLS is enabled on students table
-- If it's enabled but has no policies, all operations will be blocked

-- Enable RLS on students table if not already enabled
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies for students table (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Allow all users to read students" ON students;
DROP POLICY IF EXISTS "Allow all users to insert students" ON students;
DROP POLICY IF EXISTS "Allow all users to update students" ON students;
DROP POLICY IF EXISTS "Allow all users to delete students" ON students;

CREATE POLICY "Allow all users to read students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow all users to insert students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all users to update students" ON students FOR UPDATE USING (true);
CREATE POLICY "Allow all users to delete students" ON students FOR DELETE USING (true);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'students';

-- Test that we can read from students table
SELECT COUNT(*) as student_count FROM students;
