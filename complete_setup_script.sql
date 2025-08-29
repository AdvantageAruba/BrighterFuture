-- Complete setup script for classes and teachers system
-- Run this script in order to set up the complete system

-- Step 1: Create teachers table first (no dependencies)
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
CREATE TABLE IF NOT EXISTS classes (
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
CREATE INDEX IF NOT EXISTS idx_classes_program_id ON classes(program_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);

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

-- Step 6: Insert sample classes linked to programs
INSERT INTO classes (name, program_id, teacher_id, max_capacity, description) VALUES
  -- Program 1: Early Learning Program
  ('Grade 1A', 1, 1, 15, 'First grade class A - foundational learning skills'),
  ('Grade 1B', 1, 1, 15, 'First grade class B - foundational learning skills'),
  ('Grade 2A', 1, 1, 15, 'Second grade class A - building on foundations'),
  ('Grade 2B', 1, 1, 15, 'Second grade class B - building on foundations'),
  
  -- Program 2: Pre-K Program
  ('Early Learners', 2, 3, 12, 'Pre-K early learning group'),
  ('Pre-K', 2, 3, 12, 'Pre-K preparation group'),
  
  -- Program 3: Individual Therapy
  ('Individual Session Room 1', 3, 2, 1, 'One-on-one therapy sessions'),
  ('Individual Session Room 2', 3, 2, 1, 'One-on-one therapy sessions'),
  
  -- Program 4: Consultation Services
  ('Consultation Group A', 4, 4, 8, 'Group consultation sessions'),
  ('Consultation Group B', 4, 5, 8, 'Group consultation sessions')
ON CONFLICT DO NOTHING;

-- Step 7: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Apply triggers to both tables
DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Verify the setup
SELECT 'Teachers table' as table_name, COUNT(*) as record_count FROM teachers
UNION ALL
SELECT 'Classes table' as table_name, COUNT(*) as record_count FROM classes;

-- Step 10: Show the complete setup
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
