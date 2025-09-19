-- Test script to check students table and RLS policies
-- First, let's check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'students';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'students';

-- Test a simple update (this should work if RLS policies are correct)
UPDATE students 
SET updated_at = NOW() 
WHERE id = 18 
RETURNING id, name, class_id, updated_at;

-- Check the current state of student 18
SELECT id, name, class_id, program_id, updated_at 
FROM students 
WHERE id = 18;

