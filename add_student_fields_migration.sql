-- Migration: Add comprehensive student fields to students table
-- This migration adds new fields for emergency contacts, medical info, and class assignments

-- Add new columns to students table
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

-- Add comments to document the new fields
COMMENT ON COLUMN students.parent_name IS 'Name of the parent or primary guardian';
COMMENT ON COLUMN students.address IS 'Student''s residential address';
COMMENT ON COLUMN students.emergency_contact IS 'Name of emergency contact person';
COMMENT ON COLUMN students.emergency_phone IS 'Phone number for emergency contact';
COMMENT ON COLUMN students.medical_conditions IS 'Current medical conditions or diagnoses';
COMMENT ON COLUMN students.allergies IS 'Known allergies or sensitivities';
COMMENT ON COLUMN students.class_name IS 'Display name of the class (for backward compatibility)';
COMMENT ON COLUMN students.teacher IS 'Name of the teacher assigned to this student';
COMMENT ON COLUMN students.class_id IS 'Foreign key reference to the classes table';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_name ON students(parent_name);
CREATE INDEX IF NOT EXISTS idx_students_emergency_contact ON students(emergency_contact);

-- Verify the migration
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'students' 
  AND column_name IN ('parent_name', 'address', 'emergency_contact', 'emergency_phone', 'medical_conditions', 'allergies', 'class_name', 'teacher', 'class_id')
ORDER BY ordinal_position;
