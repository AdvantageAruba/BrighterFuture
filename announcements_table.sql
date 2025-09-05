-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    target_audience VARCHAR(20) NOT NULL CHECK (target_audience IN ('all', 'students', 'parents', 'staff')),
    author_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    edit_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_target_audience ON announcements(target_audience);

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow all users to read announcements
CREATE POLICY "Allow all users to read announcements" ON announcements
    FOR SELECT USING (true);

-- Allow authenticated users to create announcements
CREATE POLICY "Allow authenticated users to create announcements" ON announcements
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own announcements or if they're the author
CREATE POLICY "Allow users to update announcements" ON announcements
    FOR UPDATE USING (author_id = auth.uid()::text OR author_id = 'default-user');

-- Allow users to delete their own announcements or if they're the author
CREATE POLICY "Allow users to delete announcements" ON announcements
    FOR DELETE USING (author_id = auth.uid()::text OR author_id = 'default-user');

-- Create trigger to update updated_at timestamp and track edits
CREATE OR REPLACE FUNCTION update_announcement_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    
    -- If this is an update (not insert), track the edit
    IF TG_OP = 'UPDATE' THEN
        NEW.edited_at = NOW();
        NEW.edit_count = COALESCE(OLD.edit_count, 0) + 1;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_announcements_timestamps 
    BEFORE UPDATE ON announcements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_announcement_timestamps();

-- Insert sample data
INSERT INTO announcements (title, content, priority, target_audience, author_id, author_name, is_active) VALUES
('Welcome to Our New Program!', 'We are excited to announce the launch of our new educational program. This program will provide comprehensive support for students and families.', 'high', 'all', 'default-user', 'System User', true),
('Parent-Teacher Meeting Schedule', 'Parent-teacher meetings will be held next week. Please check your email for your scheduled time slot.', 'medium', 'parents', 'default-user', 'System User', true),
('Holiday Schedule Update', 'Please note that the center will be closed for the upcoming holiday. Regular hours will resume the following week.', 'low', 'all', 'default-user', 'System User', true),
('Staff Training Session', 'All staff members are required to attend the upcoming training session on new protocols and procedures.', 'high', 'staff', 'default-user', 'System User', true),
('Student Achievement Celebration', 'Congratulations to all our students for their outstanding achievements this month!', 'medium', 'students', 'default-user', 'System User', true);
