-- Create messages table for Brighter Future messaging system
-- This table stores all messages between users

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments to document the table and fields
COMMENT ON TABLE messages IS 'Stores messages between users in the Brighter Future application';
COMMENT ON COLUMN messages.sender_id IS 'ID of the user who sent the message';
COMMENT ON COLUMN messages.recipient_id IS 'ID of the user who received the message';
COMMENT ON COLUMN messages.subject IS 'Subject line of the message';
COMMENT ON COLUMN messages.content IS 'Main content/body of the message';
COMMENT ON COLUMN messages.is_read IS 'Whether the message has been read by the recipient';
COMMENT ON COLUMN messages.read_at IS 'Timestamp when the message was read';
COMMENT ON COLUMN messages.created_at IS 'Timestamp when the message was created';
COMMENT ON COLUMN messages.updated_at IS 'Timestamp when the message was last updated';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Create a composite index for efficient querying of user's messages
CREATE INDEX IF NOT EXISTS idx_messages_user_conversation ON messages(sender_id, recipient_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view messages they sent or received
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (
    auth.uid()::text IN (
      SELECT email FROM users WHERE id = sender_id OR id = recipient_id
    )
  );

-- Users can insert messages (send new messages)
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid()::text IN (
      SELECT email FROM users WHERE id = sender_id
    )
  );

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can update messages they received" ON messages
  FOR UPDATE USING (
    auth.uid()::text IN (
      SELECT email FROM users WHERE id = recipient_id
    )
  );

-- Insert some sample messages for testing (only if users exist)
-- First, let's check if we have at least 2 users to create sample messages
DO $$
DECLARE
    user_count INTEGER;
    first_user_id INTEGER;
    second_user_id INTEGER;
BEGIN
    -- Count existing users
    SELECT COUNT(*) INTO user_count FROM users;
    
    -- Only insert sample messages if we have at least 2 users
    IF user_count >= 2 THEN
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
        RAISE NOTICE 'Not enough users to create sample messages. Please add users first.';
    END IF;
END $$;
