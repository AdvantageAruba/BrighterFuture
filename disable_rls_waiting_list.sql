-- Quick fix: Disable RLS for development
-- This will allow all operations without authentication checks
ALTER TABLE waiting_list DISABLE ROW LEVEL SECURITY;

-- If you want to re-enable RLS later with proper policies, run:
-- ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;
