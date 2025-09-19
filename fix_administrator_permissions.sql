-- Fix administrator permissions to include announcements
-- This script adds the missing 'announcements' permission to all administrator users

-- Update all administrator users to include announcements permission
UPDATE users 
SET permissions = permissions || ARRAY['announcements']
WHERE role = 'administrator' 
AND NOT ('announcements' = ANY(permissions));

-- Also add 'all' permission to administrators for full access
UPDATE users 
SET permissions = permissions || ARRAY['all']
WHERE role = 'administrator' 
AND NOT ('all' = ANY(permissions));

-- Verify the changes
SELECT 
    first_name, 
    last_name, 
    email, 
    role, 
    permissions
FROM users 
WHERE role = 'administrator';