-- Add children_ids field to users table for parent-child relationships
-- This field will store an array of student IDs that a parent user can access

-- Add the children_ids column as an integer array
ALTER TABLE users 
ADD COLUMN children_ids INTEGER[] DEFAULT '{}';

-- Add comment to document the field
COMMENT ON COLUMN users.children_ids IS 'Array of student IDs that this parent user can access. Only applicable for users with role "parent".';

-- Create an index on the children_ids array for better query performance
CREATE INDEX idx_users_children_ids ON users USING GIN (children_ids);

-- Update existing parent users to have empty array if they don't have children_ids set
UPDATE users 
SET children_ids = '{}' 
WHERE role = 'parent' AND children_ids IS NULL;

-- Optional: Add a more flexible check constraint
-- This allows both NULL and empty array for non-parents, and any array for parents
-- First, let's update existing non-parent users to have NULL children_ids
UPDATE users 
SET children_ids = NULL 
WHERE role != 'parent';

-- Note: Check constraint removed to avoid conflicts with existing data
-- The application logic will handle the validation instead
-- If you want to add a constraint later, you can do:
-- ALTER TABLE users 
-- ADD CONSTRAINT check_parent_children_ids 
-- CHECK (
--   (role = 'parent') OR 
--   (role != 'parent' AND (children_ids IS NULL OR children_ids = '{}'))
-- );
