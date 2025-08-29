-- Step 3: Verify the complete setup
-- Run this script after both step1 and step2 are completed

-- Check table counts
SELECT 'Teachers table' as table_name, COUNT(*) as record_count FROM teachers
UNION ALL
SELECT 'Classes table' as table_name, COUNT(*) as record_count FROM classes;

-- Check table structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('teachers', 'classes')
ORDER BY table_name, ordinal_position;

-- Show the complete setup with relationships
SELECT 
  c.name as class_name,
  p.name as program_name,
  t.name as teacher_name,
  c.max_capacity,
  c.current_enrollment
FROM classes c
JOIN programs p ON c.program_id = p.id
LEFT JOIN teachers t ON c.teacher_id = t.id
ORDER BY p.id, c.name;
