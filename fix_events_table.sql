-- Update events table to fix UUID issue
-- Run this if you already have the events table created

-- First, drop the existing table if it exists
DROP TABLE IF EXISTS events CASCADE;

-- Recreate the events table with VARCHAR author_id
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('meeting', 'therapy', 'assessment', 'consultation', 'training', 'other')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255),
  description TEXT,
  attendees TEXT,
  program_id INTEGER REFERENCES programs(id),
  program_name VARCHAR(255),
  student_id INTEGER REFERENCES students(id),
  student_name VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  recurring BOOLEAN DEFAULT FALSE,
  recurring_type VARCHAR(20) CHECK (recurring_type IN ('daily', 'weekly', 'monthly')),
  reminder_minutes INTEGER DEFAULT 15,
  notes TEXT,
  author_id VARCHAR(255),
  author_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_program_id ON events(program_id);
CREATE INDEX IF NOT EXISTS idx_events_student_id ON events(student_id);
CREATE INDEX IF NOT EXISTS idx_events_author_id ON events(author_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for events table
CREATE POLICY "Users can view all events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can insert events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid()::text = author_id OR author_id = 'default-user');

CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid()::text = author_id OR author_id = 'default-user');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();

-- Insert sample data
INSERT INTO events (
  title, type, date, start_time, end_time, location, description, attendees,
  program_name, student_name, priority, notes, author_name
) VALUES 
(
  'IEP Meeting - Emma Rodriguez',
  'meeting',
  '2024-01-15',
  '09:00:00',
  '10:00:00',
  'Conference Room A',
  'Individual Education Program meeting to discuss Emma''s progress and update her learning goals.',
  'Dr. Johnson, Ms. Smith, Parent',
  'Brighter Future Academy',
  'Emma Rodriguez',
  'high',
  'Please bring previous assessment results and current IEP documentation.',
  'Dr. Johnson'
),
(
  'Group Therapy Session',
  'therapy',
  '2024-01-15',
  '11:30:00',
  '12:30:00',
  'Therapy Room 2',
  'Weekly group therapy session focusing on social skills development and peer interaction.',
  'Dr. Wilson, 6 students',
  'First Steps',
  NULL,
  'medium',
  'Focus on turn-taking and communication skills this week.',
  'Dr. Wilson'
),
(
  'Assessment - Michael Chen',
  'assessment',
  '2024-01-15',
  '14:00:00',
  '15:00:00',
  'Assessment Room',
  'Comprehensive developmental assessment to evaluate progress and adjust intervention strategies.',
  'Dr. Brown, Parent',
  'First Steps',
  'Michael Chen',
  'high',
  'This is a follow-up assessment after 3 months of intervention.',
  'Dr. Brown'
),
(
  'Parent Consultation',
  'consultation',
  '2024-01-16',
  '16:00:00',
  '17:00:00',
  'Office 3',
  'Consultation meeting to discuss home strategies and coordinate care between school and home.',
  'Dr. Johnson, Parent',
  'Individual Therapy',
  'Isabella Garcia',
  'medium',
  NULL,
  'Dr. Johnson'
);

