-- Complete Final Setup Script for Classes, Teachers, and Student Fields
-- Run this script to set up the complete system with real class names

-- Step 1: Create teachers table (no dependencies)
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  specialization VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create classes table (depends on programs and teachers)
DROP TABLE IF EXISTS classes CASCADE;
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
  max_capacity INTEGER DEFAULT 20,
  current_enrollment INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Add indexes for better performance
CREATE INDEX idx_classes_program_id ON classes(program_id);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_teachers_status ON teachers(status);

-- Step 4: Add comments for documentation
COMMENT ON TABLE teachers IS 'Stores information about teachers and staff members';
COMMENT ON TABLE classes IS 'Stores class information linked to programs and assigned teachers';
COMMENT ON COLUMN classes.program_id IS 'References the program this class belongs to';
COMMENT ON COLUMN classes.teacher_id IS 'References the teacher assigned to this class';

-- Step 5: Insert sample teachers
INSERT INTO teachers (name, email, phone, specialization, status) VALUES
  ('Ms. Emily Smith', 'emily.smith@brighterfuture.com', '+297-555-0101', 'Early Childhood Education', 'active'),
  ('Dr. Michael Wilson', 'michael.wilson@brighterfuture.com', '+297-555-0102', 'Speech Therapy', 'active'),
  ('Ms. Lisa Brown', 'lisa.brown@brighterfuture.com', '+297-555-0103', 'Special Education', 'active'),
  ('Dr. Sarah Johnson', 'sarah.johnson@brighterfuture.com', '+297-555-0104', 'Behavioral Therapy', 'active'),
  ('Ms. Jennifer Davis', 'jennifer.davis@brighterfuture.com', '+297-555-0105', 'Occupational Therapy', 'active')
ON CONFLICT DO NOTHING;

-- Step 6: Insert real classes based on actual programs
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

-- Step 7: Add comprehensive student fields
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS parent_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS medical_conditions TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS class_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS teacher VARCHAR(255),
ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL;

-- Step 8: Create indexes for student fields
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_name ON students(parent_name);
CREATE INDEX IF NOT EXISTS idx_students_emergency_contact ON students(emergency_contact);

-- Step 9: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 10: Apply triggers to both tables
DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Verify the complete setup
SELECT '=== VERIFICATION RESULTS ===' as info;

SELECT 'Teachers table' as table_name, COUNT(*) as record_count FROM teachers
UNION ALL
SELECT 'Classes table' as table_name, COUNT(*) as record_count FROM classes;

SELECT '=== CLASSES BY PROGRAM ===' as info;
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

SELECT '=== STUDENT FIELDS ADDED ===' as info;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'students' 
  AND column_name IN ('parent_name', 'address', 'emergency_contact', 'emergency_phone', 'medical_conditions', 'allergies', 'class_name', 'teacher', 'class_id')
ORDER BY ordinal_position;
