-- Drop existing daily_notes table if it exists
DROP TABLE IF EXISTS daily_notes CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create daily_notes table with correct schema
CREATE TABLE daily_notes (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  program_id INTEGER NOT NULL,
  program_name VARCHAR(255) NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  notes TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_daily_notes_student_id ON daily_notes(student_id);
CREATE INDEX idx_daily_notes_program_id ON daily_notes(program_id);
CREATE INDEX idx_daily_notes_date ON daily_notes(date);
CREATE INDEX idx_daily_notes_author_id ON daily_notes(author_id);
CREATE INDEX idx_daily_notes_created_at ON daily_notes(created_at);

-- Create trigger function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_daily_notes_updated_at 
    BEFORE UPDATE ON daily_notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- TEMPORARILY DISABLE RLS FOR TESTING
-- Comment out the RLS section below if you want to enable it later
/*
-- Enable Row Level Security (RLS)
ALTER TABLE daily_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow authenticated users to select (read) daily notes
CREATE POLICY "Allow authenticated users to select daily notes" ON daily_notes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert (create) daily notes
CREATE POLICY "Allow authenticated users to insert daily notes" ON daily_notes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update daily notes
CREATE POLICY "Allow authenticated users to update daily notes" ON daily_notes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete daily notes
CREATE POLICY "Allow authenticated users to delete daily notes" ON daily_notes
    FOR DELETE USING (auth.role() = 'authenticated');
*/
