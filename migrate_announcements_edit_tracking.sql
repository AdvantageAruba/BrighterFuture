-- Migration script to add edit tracking to existing announcements table
-- Run this script if you already have an announcements table

-- Add new columns for edit tracking
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0;

-- Update the trigger function to handle edit tracking
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

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;

-- Create the new trigger (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_announcements_timestamps' 
        AND tgrelid = 'announcements'::regclass
    ) THEN
        CREATE TRIGGER update_announcements_timestamps 
            BEFORE UPDATE ON announcements 
            FOR EACH ROW 
            EXECUTE FUNCTION update_announcement_timestamps();
    END IF;
END $$;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_announcements_edited_at ON announcements(edited_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_edit_count ON announcements(edit_count);

-- Update existing announcements to have edit_count = 0 (they haven't been edited yet)
UPDATE announcements 
SET edit_count = 0 
WHERE edit_count IS NULL;
