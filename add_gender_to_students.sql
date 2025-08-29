-- Migration: Add gender field to students table
-- This migration adds a gender field to store student gender information

-- Add gender column to students table if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS gender VARCHAR(50);

-- Add comment to document the field
COMMENT ON COLUMN students.gender IS 'Student gender (male, female, other, prefer-not-to-say)';

-- Create an index on the gender field for better query performance
CREATE INDEX IF NOT EXISTS idx_students_gender ON students(gender);

-- Update existing records to have a default gender value if needed
-- UPDATE students SET gender = 'Not specified' WHERE gender IS NULL;

-- Optional: Add a check constraint to ensure valid gender values
-- ALTER TABLE students ADD CONSTRAINT check_gender_values 
-- CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say', 'Not specified'));

