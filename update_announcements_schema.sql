-- Update announcements table to support multiple target audiences and proper author tracking
-- This script modifies the existing announcements table

-- First, let's add a new column for multiple target audiences
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS target_audiences TEXT[] DEFAULT ARRAY['all'];

-- Update existing records to use the new array format
UPDATE announcements 
SET target_audiences = ARRAY[target_audience] 
WHERE target_audiences IS NULL;

-- Update author tracking to use proper user IDs
-- We'll need to update this based on actual user data
UPDATE announcements 
SET author_id = 'system-admin', 
    author_name = 'System Administrator'
WHERE author_id = 'default-user';

-- Add index for the new target_audiences column (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_announcements_target_audiences'
    ) THEN
        CREATE INDEX idx_announcements_target_audiences 
        ON announcements USING GIN (target_audiences);
    END IF;
END $$;

-- Update the constraint to allow multiple values
-- Note: We'll keep the old column for backward compatibility but use the new array column
ALTER TABLE announcements 
DROP CONSTRAINT IF EXISTS announcements_target_audience_check;

-- Add a check constraint for the new array column (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'announcements_target_audiences_check'
    ) THEN
        ALTER TABLE announcements 
        ADD CONSTRAINT announcements_target_audiences_check 
        CHECK (target_audiences <@ ARRAY['all', 'administrator', 'teacher', 'parent', 'student']);
    END IF;
END $$;

-- Update RLS policies to work with the new structure
DROP POLICY IF EXISTS "Allow all users to read announcements" ON announcements;

-- Only create the new policy if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Allow users to read relevant announcements' 
        AND tablename = 'announcements'
    ) THEN
        CREATE POLICY "Allow users to read relevant announcements" ON announcements
            FOR SELECT USING (
                'all' = ANY(target_audiences) OR 
                current_setting('app.current_user_role', true) = ANY(target_audiences)
            );
    END IF;
END $$;

-- Update the trigger function to handle the new structure
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

-- Add comment to document the changes
COMMENT ON COLUMN announcements.target_audiences IS 'Array of target audience roles that can see this announcement';
COMMENT ON COLUMN announcements.author_id IS 'ID of the user who created this announcement';
COMMENT ON COLUMN announcements.author_name IS 'Display name of the user who created this announcement';
