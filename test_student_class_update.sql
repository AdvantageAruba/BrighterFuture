-- Test the students table structure and class_id field
-- Check if class_id field exists and what type it is
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
AND column_name LIKE '%class%';

-- Check current student data for Angelo Kelly
SELECT id, name, class_name, program_id, teacher 
FROM students 
WHERE name ILIKE '%angelo%' OR name ILIKE '%kelly%';

-- Test updating a student's class_name
UPDATE students 
SET class_name = 'Test Class', updated_at = NOW() 
WHERE name ILIKE '%angelo%' OR name ILIKE '%kelly%'
RETURNING id, name, class_name, updated_at;

-- Check if the update worked
SELECT id, name, class_name, program_id, teacher, updated_at 
FROM students 
WHERE name ILIKE '%angelo%' OR name ILIKE '%kelly%';
