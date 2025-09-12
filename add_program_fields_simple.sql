-- Simple migration script to add essential program fields
-- Run this script in your Supabase SQL editor first

-- Add essential columns to programs table
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
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'programs' 
ORDER BY ordinal_position;
