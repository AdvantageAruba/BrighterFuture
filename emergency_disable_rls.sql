-- EMERGENCY FIX: Temporarily disable RLS for faster development
-- This will make authentication and data loading much faster

-- Disable RLS on all main tables temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_list DISABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms DISABLE ROW LEVEL SECURITY;

-- Test that we can read data quickly
SELECT 'RLS disabled successfully' as status;

-- Test queries
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as student_count FROM students;
SELECT COUNT(*) as program_count FROM programs;
SELECT COUNT(*) as class_count FROM classes;

-- Test specific user lookup (this was timing out)
SELECT id, email, first_name, last_name, role FROM users WHERE email = 'admin@brighterfuture.edu';

-- Test students query
SELECT id, name, program_id, class_id FROM students LIMIT 5;

