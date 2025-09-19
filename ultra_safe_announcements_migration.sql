-- Ultra-safe migration for announcements table
-- This version checks everything before making any changes

-- Step 1: Add the new target_audiences column (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'announcements' 
        AND column_name = 'target_audiences'
    ) THEN
        ALTER TABLE announcements 
        ADD COLUMN target_audiences TEXT[] DEFAULT ARRAY['all'];
    END IF;
END $$;

-- Step 2: Update existing records to use the new array format
UPDATE announcements 
SET target_audiences = ARRAY[target_audience] 
WHERE target_audiences IS NULL OR target_audiences = ARRAY['all'];

-- Step 3: Update author tracking
UPDATE announcements 
SET author_id = 'system-admin', 
    author_name = 'System Administrator'
WHERE author_id = 'default-user' OR author_id IS NULL;

-- Step 4: Add index (only if it doesn't exist)
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

-- Step 5: Drop old constraint (only if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'announcements_target_audience_check'
    ) THEN
        ALTER TABLE announcements 
        DROP CONSTRAINT announcements_target_audience_check;
    END IF;
END $$;

-- Step 6: Add new constraint (only if it doesn't exist)
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

-- Step 7: Update RLS policies
DO $$ 
BEGIN
    -- Drop old policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Allow all users to read announcements' 
        AND tablename = 'announcements'
    ) THEN
        DROP POLICY "Allow all users to read announcements" ON announcements;
    END IF;
    
    -- Create new policy only if it doesn't exist
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

-- Step 8: Update trigger function (this is safe to replace)
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

-- Step 9: Add comments (these are safe to add)
COMMENT ON COLUMN announcements.target_audiences IS 'Array of target audience roles that can see this announcement';
COMMENT ON COLUMN announcements.author_id IS 'ID of the user who created this announcement';
COMMENT ON COLUMN announcements.author_name IS 'Display name of the user who created this announcement';

-- Step 10: Verify the migration
SELECT 
    'Migration completed successfully!' as status,
    COUNT(*) as total_announcements,
    COUNT(CASE WHEN target_audiences IS NOT NULL THEN 1 END) as announcements_with_new_format
FROM announcements;

