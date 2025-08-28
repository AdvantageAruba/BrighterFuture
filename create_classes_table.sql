-- Create classes table for Brighter Future application
-- This table stores class information within programs

CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  description TEXT,
  max_students INTEGER DEFAULT 20,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments to document the table and fields
COMMENT ON TABLE classes IS 'Stores class information within programs for organizing students';
COMMENT ON COLUMN classes.id IS 'Unique class identifier (e.g., "Class A", "Morning Group")';
COMMENT ON COLUMN classes.name IS 'Display name for the class';
COMMENT ON COLUMN classes.program_id IS 'ID of the program this class belongs to';
COMMENT ON COLUMN classes.description IS 'Description of the class';
COMMENT ON COLUMN classes.max_students IS 'Maximum number of students allowed in this class';
COMMENT ON COLUMN classes.status IS 'Class status (active, inactive, full)';
COMMENT ON COLUMN classes.created_at IS 'Timestamp when class was created';
COMMENT ON COLUMN classes.updated_at IS 'Timestamp when class was last updated';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_program_id ON classes(program_id);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);

-- Insert some sample classes for testing
INSERT INTO classes (id, name, program_id, description, max_students, status) VALUES
('class-a', 'Class A', 1, 'Morning session for ages 3-5', 15, 'active'),
('class-b', 'Class B', 1, 'Afternoon session for ages 3-5', 15, 'active'),
('class-c', 'Class C', 2, 'Advanced learning group', 12, 'active'),
('class-d', 'Class D', 2, 'Beginner learning group', 12, 'active')
ON CONFLICT (id) DO NOTHING;
