-- Migration: Add picture field to students table
-- This migration adds a picture_url field to store student profile pictures

-- Add picture_url column to students table
ALTER TABLE students 
ADD COLUMN picture_url TEXT;

-- Add comment to document the field
COMMENT ON COLUMN students.picture_url IS 'URL to the student profile picture stored in Supabase Storage';

-- Create a storage bucket for student pictures if it doesn't exist
-- Note: This needs to be run in the Supabase dashboard or via the API
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('student-pictures', 'student-pictures', true)
-- ON CONFLICT (id) DO NOTHING;

-- Create storage policy for student pictures
-- Note: This needs to be run in the Supabase dashboard or via the API
-- CREATE POLICY "Student pictures are publicly accessible" ON storage.objects
-- FOR SELECT USING (bucket_id = 'student-pictures');

-- CREATE POLICY "Users can upload student pictures" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'student-pictures');

-- CREATE POLICY "Users can update student pictures" ON storage.objects
-- FOR UPDATE USING (bucket_id = 'student-pictures');

-- CREATE POLICY "Users can delete student pictures" ON storage.objects
-- FOR DELETE USING (bucket_id = 'student-pictures');
