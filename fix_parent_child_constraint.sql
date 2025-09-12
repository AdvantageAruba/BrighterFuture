-- Fix existing constraint violation
-- This script should be run if you're getting constraint violations

-- First, drop the existing constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_parent_children_ids;

-- Note: Since children_ids column doesn't exist yet, we don't need to update it
-- The add_parent_child_relationship.sql script will handle adding the column
-- and setting up the data properly

-- Optional: Add a more flexible constraint (commented out to avoid issues)
-- ALTER TABLE users 
-- ADD CONSTRAINT check_parent_children_ids 
-- CHECK (
--   (role = 'parent') OR 
--   (role != 'parent' AND (children_ids IS NULL OR children_ids = '{}'))
-- );
