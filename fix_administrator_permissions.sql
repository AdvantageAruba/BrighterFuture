-- Fix administrator permissions to include all required permissions
-- This ensures administrators have access to all tabs

UPDATE users 
SET permissions = ARRAY[
    'students', 'programs', 'classes', 'users', 'attendance',
    'calendar', 'forms', 'notes', 'reports', 'waiting_list',
    'settings', 'backup', 'logs', 'messages', 'announcements', 'notifications'
],
visible_tabs = ARRAY[
    'dashboard', 'students', 'programs', 'classes', 'calendar',
    'attendance', 'forms', 'notes', 'reports', 'messages',
    'announcements', 'users', 'settings', 'waiting_list'
]
WHERE role = 'administrator';

-- Verify the update
SELECT id, first_name, last_name, email, role, permissions, visible_tabs 
FROM users 
WHERE role = 'administrator';
