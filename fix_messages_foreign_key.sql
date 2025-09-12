-- Fix foreign key constraint error in messages table
-- This script should be run if you're getting foreign key constraint violations

-- First, let's check if the messages table exists and has any data
DO $$
DECLARE
    table_exists BOOLEAN;
    message_count INTEGER;
BEGIN
    -- Check if messages table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'messages'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Count messages
        SELECT COUNT(*) INTO message_count FROM messages;
        
        IF message_count > 0 THEN
            -- Delete any messages that reference non-existent users
            DELETE FROM messages 
            WHERE sender_id NOT IN (SELECT id FROM users) 
            OR recipient_id NOT IN (SELECT id FROM users);
            
            RAISE NOTICE 'Cleaned up % invalid message references', message_count;
        END IF;
        
        -- Now insert sample messages safely
        -- Count existing users
        SELECT COUNT(*) INTO message_count FROM users;
        
        -- Only insert sample messages if we have at least 2 users
        IF message_count >= 2 THEN
            -- Get the first two user IDs
            DECLARE
                first_user_id INTEGER;
                second_user_id INTEGER;
            BEGIN
                SELECT id INTO first_user_id FROM users ORDER BY id LIMIT 1;
                SELECT id INTO second_user_id FROM users ORDER BY id OFFSET 1 LIMIT 1;
                
                -- Insert sample messages between these users (only if they don't already exist)
                INSERT INTO messages (sender_id, recipient_id, subject, content) 
                SELECT first_user_id, second_user_id, 'Welcome to Brighter Future!', 'Welcome to our team! We are excited to have you on board. Please let me know if you have any questions.'
                WHERE NOT EXISTS (
                    SELECT 1 FROM messages 
                    WHERE sender_id = first_user_id AND recipient_id = second_user_id 
                    AND subject = 'Welcome to Brighter Future!'
                );
                
                INSERT INTO messages (sender_id, recipient_id, subject, content) 
                SELECT second_user_id, first_user_id, 'Thank you!', 'Thank you for the warm welcome. I am looking forward to working with everyone.'
                WHERE NOT EXISTS (
                    SELECT 1 FROM messages 
                    WHERE sender_id = second_user_id AND recipient_id = first_user_id 
                    AND subject = 'Thank you!'
                );
                
                RAISE NOTICE 'Sample messages inserted successfully between users % and %', first_user_id, second_user_id;
            END;
        ELSE
            RAISE NOTICE 'Not enough users to create sample messages. Please add users first.';
        END IF;
    ELSE
        RAISE NOTICE 'Messages table does not exist. Please run create_messages_table.sql first.';
    END IF;
END $$;

