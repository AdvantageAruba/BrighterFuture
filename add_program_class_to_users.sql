-- Migration: Add program and class fields to users table
-- This migration adds program_id and class_id fields to store user program and class assignments

-- Add program_id column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS program_id INTEGER REFERENCES programs(id);

-- Add class_id column to users table (for specific class assignments)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS class_id VARCHAR(50);

-- Add comments to document the new fields
COMMENT ON COLUMN users.program_id IS 'ID of the program the user is primarily associated with';
COMMENT ON COLUMN users.class_id IS 'Specific class identifier for teachers (e.g., "Class A", "Morning Group")';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_program_id ON users(program_id);
CREATE INDEX IF NOT EXISTS idx_users_class_id ON users(class_id);

-- Update existing users to have default program if they're teachers
-- This is optional - you can run this to set default values
-- UPDATE users SET program_id = (SELECT id FROM programs LIMIT 1) WHERE role = 'teacher' AND program_id IS NULL;
