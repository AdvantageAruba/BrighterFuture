-- Step 2: Create classes table (depends on teachers table)
-- Run this script AFTER step1_create_teachers.sql

-- First, drop the existing classes table if it exists (to avoid column conflicts)
DROP TABLE IF EXISTS classes CASCADE;

-- Create classes table with program relationship
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

-- Add indexes for better performance
CREATE INDEX idx_classes_program_id ON classes(program_id);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);

-- Add comments for documentation
COMMENT ON TABLE classes IS 'Stores class information linked to programs and assigned teachers';
COMMENT ON COLUMN classes.program_id IS 'References the program this class belongs to';
COMMENT ON COLUMN classes.teacher_id IS 'References the teacher assigned to this class';

-- Insert sample classes linked to programs
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
  ('Consultation Group B', 4, 5, 8, 'Group consultation sessions');

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to the classes table
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
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
