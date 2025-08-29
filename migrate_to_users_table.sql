-- Migration script to use users table instead of separate teachers table
-- This script will:
-- 1. Update the classes table to reference users instead of teachers
-- 2. Remove the old teachers table
-- 3. Ensure proper foreign key constraints

-- Step 1: Add a temporary column to store user IDs
ALTER TABLE classes ADD COLUMN IF NOT EXISTS teacher_user_id INTEGER;

-- Step 2: Update the teacher_user_id based on existing teacher names
-- This assumes you have users with teacher roles already in the users table
-- You may need to manually map existing teachers to users first

-- Step 3: Drop the old teacher_id column and rename the new one
ALTER TABLE classes DROP COLUMN IF EXISTS teacher_id;
ALTER TABLE classes RENAME COLUMN teacher_user_id TO teacher_id;

-- Step 4: Add foreign key constraint to users table
ALTER TABLE classes 
ADD CONSTRAINT fk_classes_teacher_user 
FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL;

-- Step 5: Drop the old teachers table (only if you're sure you don't need it)
-- DROP TABLE IF EXISTS teachers CASCADE;

-- Step 6: Update any existing classes that don't have valid teacher references
-- This will set teacher_id to NULL for any invalid references
UPDATE classes 
SET teacher_id = NULL 
WHERE teacher_id IS NOT NULL 
AND teacher_id NOT IN (SELECT id FROM users WHERE role = 'teacher');

-- Note: Before running this script, ensure you have:
-- 1. Users with role = 'teacher' in your users table
-- 2. Manually mapped any existing teacher data to user IDs if needed
-- 3. Backed up your data

-- To verify the migration worked:
-- SELECT c.name as class_name, 
--        CONCAT(u.first_name, ' ', u.last_name) as teacher_name,
--        u.email as teacher_email
-- FROM classes c
-- LEFT JOIN users u ON c.teacher_id = u.id
-- WHERE u.role = 'teacher' OR c.teacher_id IS NULL;
