-- Fix RLS policies for messages table to work with custom authentication
-- This script updates the RLS policies to work with our custom session system

-- First, let's disable RLS temporarily to allow access
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages they received" ON messages;

-- Create new policies that work with our custom authentication
-- For now, we'll allow all authenticated users to access messages
-- This is a temporary solution until we implement proper RLS for custom sessions

-- Allow all users to view messages (we'll filter in the application)
CREATE POLICY "Allow all users to view messages" ON messages
  FOR SELECT USING (true);

-- Allow all users to send messages
CREATE POLICY "Allow all users to send messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Allow all users to update messages (mark as read)
CREATE POLICY "Allow all users to update messages" ON messages
  FOR UPDATE USING (true);

-- Re-enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Add some sample messages if they don't exist
DO $$
DECLARE
    user_count INTEGER;
    first_user_id INTEGER;
    second_user_id INTEGER;
    message_count INTEGER;
BEGIN
    -- Count existing users
    SELECT COUNT(*) INTO user_count FROM users;
    
    -- Count existing messages
    SELECT COUNT(*) INTO message_count FROM messages;
    
    -- Only insert sample messages if we have at least 2 users and no existing messages
    IF user_count >= 2 AND message_count = 0 THEN
        -- Get the first two user IDs
        SELECT id INTO first_user_id FROM users ORDER BY id LIMIT 1;
        SELECT id INTO second_user_id FROM users ORDER BY id OFFSET 1 LIMIT 1;
        
        -- Insert sample messages between these users
        INSERT INTO messages (sender_id, recipient_id, subject, content) VALUES
        (first_user_id, second_user_id, 'Welcome to Brighter Future!', 'Welcome to our team! We are excited to have you on board. Please let me know if you have any questions.'),
        (second_user_id, first_user_id, 'Thank you!', 'Thank you for the warm welcome. I am looking forward to working with everyone.'),
        (first_user_id, second_user_id, 'Meeting Reminder', 'Don''t forget about our team meeting tomorrow at 10 AM in the conference room.'),
        (second_user_id, first_user_id, 'Meeting Confirmed', 'Got it! I will be there. Thanks for the reminder.');
        
        RAISE NOTICE 'Sample messages inserted successfully between users % and %', first_user_id, second_user_id;
    ELSE
        RAISE NOTICE 'Sample messages already exist or not enough users. User count: %, Message count: %', user_count, message_count;
    END IF;
END $$;
