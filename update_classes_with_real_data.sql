-- Update classes table with real class names from programs
-- This script replaces the generic sample data with actual class names

-- First, clear existing classes data
TRUNCATE classes RESTART IDENTITY CASCADE;

-- Insert real classes based on actual programs
INSERT INTO classes (name, program_id, teacher_id, max_capacity, description) VALUES
  -- Program 1: Brighter Future Academy (color-based classes)
  ('Red Class', 1, 1, 15, 'Morning session for ages 5-8 - foundational learning skills'),
  ('Blue Class', 1, 1, 15, 'Afternoon session for ages 5-8 - building on foundations'),
  ('Green Class', 1, 1, 12, 'Advanced learning group for ages 9-12'),
  ('Yellow Class', 1, 1, 15, 'Mixed age group for ages 6-10'),
  ('Purple Class', 1, 1, 12, 'Specialized learning group for ages 11-14'),
  
  -- Program 2: First Steps (number-based classes)
  ('Class 1', 2, 3, 12, 'Early learners group for ages 2-3'),
  ('Class 2', 2, 3, 12, 'Pre-K preparation group for ages 3-4'),
  ('Class 3', 2, 3, 10, 'Advanced early intervention for ages 4-5'),
  ('Class 4', 2, 3, 8, 'Small group intensive support for ages 3-6'),
  
  -- Program 3: Individual Therapy (room-based classes)
  ('Individual Session Room 1', 3, 2, 1, 'One-on-one therapy sessions - Room 1'),
  ('Individual Session Room 2', 3, 2, 1, 'One-on-one therapy sessions - Room 2'),
  ('Individual Session Room 3', 3, 2, 1, 'One-on-one therapy sessions - Room 3'),
  ('Individual Session Room 4', 3, 2, 1, 'One-on-one therapy sessions - Room 4'),
  
  -- Program 4: Consultation Services (group-based classes)
  ('Consultation Group A', 4, 4, 8, 'Morning consultation group sessions'),
  ('Consultation Group B', 4, 5, 8, 'Afternoon consultation group sessions'),
  ('Consultation Group C', 4, 4, 6, 'Evening consultation group sessions'),
  ('Family Consultation Group', 4, 5, 10, 'Family-focused consultation sessions');

-- Verify the updated classes
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

-- Show class count by program
SELECT 
  p.name as program_name,
  COUNT(c.id) as class_count,
  SUM(c.max_capacity) as total_capacity
FROM programs p
LEFT JOIN classes c ON p.id = c.program_id
GROUP BY p.id, p.name
ORDER BY p.id;
