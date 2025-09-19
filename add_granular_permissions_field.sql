-- Add granular_permissions field to users table
-- This field will store granular permissions as JSONB for better querying and flexibility

-- Add the granular_permissions column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS granular_permissions JSONB DEFAULT '{}'::jsonb;

-- Add a comment to explain the field
COMMENT ON COLUMN users.granular_permissions IS 'Granular permissions stored as JSONB with structure: {"permission_id": ["operation1", "operation2"]}';

-- Create an index for better performance when querying granular permissions
CREATE INDEX IF NOT EXISTS idx_users_granular_permissions 
ON users USING GIN (granular_permissions);

-- Example of how granular_permissions should be structured:
-- {
--   "students": ["view", "create", "edit"],
--   "programs": ["view"],
--   "classes": ["view", "create"],
--   "users": ["view"],
--   "attendance": ["view", "create", "edit"],
--   "calendar": ["view"],
--   "forms": ["view", "create"],
--   "notes": ["view", "create", "edit"],
--   "reports": ["view"],
--   "waiting_list": ["view"],
--   "settings": ["view"],
--   "backup": [],
--   "logs": [],
--   "announcements": ["view"],
--   "notifications": ["view"]
-- }

-- Update existing users to have empty granular_permissions if they don't have it
UPDATE users 
SET granular_permissions = '{}'::jsonb 
WHERE granular_permissions IS NULL;

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'granular_permissions';
