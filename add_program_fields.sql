-- Add missing fields to programs table for EditProgram functionality
-- Run this script in your Supabase SQL editor

-- Add new columns to programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS type VARCHAR(100),
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS age_range VARCHAR(100),
ADD COLUMN IF NOT EXISTS age_range_start INTEGER,
ADD COLUMN IF NOT EXISTS age_range_end INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS schedule TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS coordinator VARCHAR(255),
ADD COLUMN IF NOT EXISTS coordinator_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS coordinator_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS objectives TEXT,
ADD COLUMN IF NOT EXISTS curriculum TEXT,
ADD COLUMN IF NOT EXISTS assessment_methods TEXT,
ADD COLUMN IF NOT EXISTS staff_requirements TEXT,
ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add comments for documentation
COMMENT ON COLUMN programs.type IS 'Type of program (e.g., Full-time Education, Early Intervention)';
COMMENT ON COLUMN programs.capacity IS 'Maximum number of students the program can accommodate';
COMMENT ON COLUMN programs.age_range IS 'Target age range for the program (formatted string)';
COMMENT ON COLUMN programs.age_range_start IS 'Starting age for the program';
COMMENT ON COLUMN programs.age_range_end IS 'Ending age for the program';
COMMENT ON COLUMN programs.location IS 'Physical location where the program takes place';
COMMENT ON COLUMN programs.schedule IS 'Program schedule and timing information';
COMMENT ON COLUMN programs.start_date IS 'Date when the program started or will start';
COMMENT ON COLUMN programs.coordinator IS 'Name of the program coordinator';
COMMENT ON COLUMN programs.coordinator_email IS 'Email address of the program coordinator';
COMMENT ON COLUMN programs.coordinator_phone IS 'Phone number of the program coordinator';
COMMENT ON COLUMN programs.requirements IS 'Program requirements and prerequisites';
COMMENT ON COLUMN programs.objectives IS 'Program objectives and goals';
COMMENT ON COLUMN programs.curriculum IS 'Program curriculum details';
COMMENT ON COLUMN programs.assessment_methods IS 'Methods used to assess student progress';
COMMENT ON COLUMN programs.staff_requirements IS 'Staff requirements and qualifications';
COMMENT ON COLUMN programs.budget IS 'Program budget allocation';
COMMENT ON COLUMN programs.notes IS 'Additional notes and information';
COMMENT ON COLUMN programs.updated_at IS 'Timestamp when the program was last updated';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(type);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_coordinator ON programs(coordinator);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'programs' 
ORDER BY ordinal_position;
