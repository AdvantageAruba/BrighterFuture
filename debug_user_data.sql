-- Check user data structure and picture_url field
SELECT id, first_name, last_name, email, picture_url, program_id, class_id
FROM users 
WHERE id IN (1, 2, 3, 4, 5)
ORDER BY id;

-- Check classes table structure
SELECT id, name, program_id
FROM classes 
WHERE id IN ('1', '2', '3', '4', '5')
ORDER BY id;
