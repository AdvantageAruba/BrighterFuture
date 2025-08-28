-- Migration: Add picture field to users table
-- This migration adds a picture_url field to store user profile pictures

-- Add picture_url column to users table (if it doesn't exist)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS picture_url TEXT;

-- Add comment to document the field
COMMENT ON COLUMN users.picture_url IS 'URL to the user profile picture stored in Supabase Storage';

-- Note: This assumes you have a users table. If you don't have one yet, you'll need to create it first.
-- The storage bucket 'user-pictures' should be created in the Supabase dashboard or via the API.

-- Create a storage bucket for user pictures if it doesn't exist
-- Note: This needs to be run in the Supabase dashboard or via the API
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('user-pictures', 'user-pictures', true)
-- ON CONFLICT (id) DO NOTHING;

-- Create storage policy for user pictures
-- Note: This needs to be run in the Supabase dashboard or via the API
-- CREATE POLICY "User pictures are publicly accessible" ON storage.objects
-- FOR SELECT USING (bucket_id = 'user-pictures');

-- CREATE POLICY "Users can upload user pictures" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'user-pictures');

-- CREATE POLICY "Users can update user pictures" ON storage.objects
-- FOR UPDATE USING (bucket_id = 'user-pictures');

-- CREATE POLICY "Users can delete user pictures" ON storage.objects
-- FOR DELETE USING (bucket_id = 'user-pictures');
