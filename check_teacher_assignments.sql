-- Check if teachers are assigned to classes
SELECT 
    c.id as class_id,
    c.name as class_name,
    c.program_id,
    p.name as program_name,
    c.teacher_id,
    u.first_name,
    u.last_name,
    u.email
FROM classes c
LEFT JOIN programs p ON c.program_id = p.id
LEFT JOIN users u ON c.teacher_id = u.id
ORDER BY p.name, c.name;

-- Check all teachers and their assignments
SELECT 
    u.id as teacher_id,
    u.first_name,
    u.last_name,
    u.email,
    u.program_id,
    u.class_id,
    c.name as assigned_class_name,
    p.name as assigned_program_name
FROM users u
LEFT JOIN classes c ON u.class_id = c.id
LEFT JOIN programs p ON u.program_id = p.id
WHERE u.role = 'teacher'
ORDER BY u.first_name;
