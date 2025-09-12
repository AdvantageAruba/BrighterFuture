-- Add visible_tabs column to users table for tab visibility control
-- This column stores an array of tab IDs that should be visible in the user's navigation

-- Add the visible_tabs column as a text array
ALTER TABLE users 
ADD COLUMN visible_tabs TEXT[] DEFAULT '{}';

-- Add a comment to explain the column
COMMENT ON COLUMN users.visible_tabs IS 'Array of tab IDs that should be visible in the user navigation menu';

-- Update existing users with default tab visibility based on their role
-- Administrator gets all tabs
UPDATE users 
SET visible_tabs = ARRAY[
  'dashboard', 'students', 'programs', 'classes', 'calendar',
  'attendance', 'forms', 'notes', 'reports', 'messages',
  'announcements', 'users', 'settings', 'waiting_list'
]
WHERE role = 'administrator';

-- Teacher gets educational tabs
UPDATE users 
SET visible_tabs = ARRAY[
  'dashboard', 'students', 'classes', 'calendar', 'attendance',     
  'forms', 'notes', 'messages', 'announcements'
]
WHERE role = 'teacher';

-- Therapist gets therapy-related tabs
UPDATE users 
SET visible_tabs = ARRAY[
  'dashboard', 'students', 'forms', 'notes', 'calendar',
  'messages', 'announcements'
]
WHERE role = 'therapist';

-- Coordinator gets management tabs
UPDATE users 
SET visible_tabs = ARRAY[
  'dashboard', 'students', 'programs', 'classes', 'calendar',
  'attendance', 'forms', 'notes', 'reports', 'messages', 'announcements'
]
WHERE role = 'coordinator';

-- Parent gets limited tabs
UPDATE users 
SET visible_tabs = ARRAY[
  'dashboard', 'students', 'calendar', 'forms', 'notes',
  'messages', 'announcements'
]
WHERE role = 'parent';

-- Staff gets basic tabs
UPDATE users 
SET visible_tabs = ARRAY[
  'dashboard', 'students', 'calendar', 'forms', 'notes',
  'messages', 'announcements'
]
WHERE role = 'staff';

-- Set default for any users without a role
UPDATE users 
SET visible_tabs = ARRAY['dashboard']
WHERE role IS NULL OR role = '';

-- Verify the changes
SELECT 
  role,
  COUNT(*) as user_count,
  visible_tabs
FROM users 
GROUP BY role, visible_tabs
ORDER BY role;
