-- Add teacher_id column to classes table
-- This allows assigning teachers to specific classes

ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Add comment to document the new field
COMMENT ON COLUMN classes.teacher_id IS 'ID of the teacher assigned to this class (references users table)';

-- Create index for better performance when querying by teacher
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);

-- Update existing classes to have no teacher assigned (optional)
-- UPDATE classes SET teacher_id = NULL WHERE teacher_id IS NULL;
