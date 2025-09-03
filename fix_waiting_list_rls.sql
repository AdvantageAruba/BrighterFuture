-- Fix RLS policies for waiting_list table
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow authenticated users to read waiting list" ON waiting_list;
DROP POLICY IF EXISTS "Allow authenticated users to insert waiting list" ON waiting_list;
DROP POLICY IF EXISTS "Allow authenticated users to update waiting list" ON waiting_list;
DROP POLICY IF EXISTS "Allow authenticated users to delete waiting list" ON waiting_list;

-- Create new policies that allow all operations (for development)
-- In production, you should implement proper authentication checks

-- Allow all users to read waiting list entries
CREATE POLICY "Allow all users to read waiting list" ON waiting_list
    FOR SELECT USING (true);

-- Allow all users to insert new waiting list entries
CREATE POLICY "Allow all users to insert waiting list" ON waiting_list
    FOR INSERT WITH CHECK (true);

-- Allow all users to update waiting list entries
CREATE POLICY "Allow all users to update waiting list" ON waiting_list
    FOR UPDATE USING (true);

-- Allow all users to delete waiting list entries
CREATE POLICY "Allow all users to delete waiting list" ON waiting_list
    FOR DELETE USING (true);

-- Alternative: If you want to keep RLS but allow service role access
-- You can also disable RLS temporarily for development:
-- ALTER TABLE waiting_list DISABLE ROW LEVEL SECURITY;
