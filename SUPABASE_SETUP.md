# Supabase Storage Setup for Student Pictures

This guide explains how to set up Supabase storage to enable student picture uploads in the Brighter Future application.

## Prerequisites

- Access to your Supabase project dashboard
- Admin privileges for your Supabase project

## Step 1: Create Storage Buckets

### Student Pictures Bucket
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Configure the bucket:
   - **Name**: `student-pictures`
   - **Public bucket**: ✅ Check this option
   - **File size limit**: 5MB (or your preferred limit)
   - **Allowed MIME types**: `image/*`
5. Click **Create bucket**

### User Pictures Bucket (Optional)
1. Create another bucket for user profile pictures:
   - **Name**: `user-pictures`
   - **Public bucket**: ✅ Check this option
   - **File size limit**: 5MB (or your preferred limit)
   - **Allowed MIME types**: `image/*`
2. Click **Create bucket**

## Step 2: Configure Storage Policies

After creating the buckets, you need to set up storage policies to control access:

### Student Pictures Policies
```sql
-- Public Read Access
CREATE POLICY "Student pictures are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'student-pictures');

-- Authenticated User Upload
CREATE POLICY "Users can upload student pictures" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'student-pictures');

-- Authenticated User Update
CREATE POLICY "Users can update student pictures" ON storage.objects
FOR UPDATE USING (bucket_id = 'student-pictures');

-- Authenticated User Delete
CREATE POLICY "Users can delete student pictures" ON storage.objects
FOR DELETE USING (bucket_id = 'student-pictures');
```

### User Pictures Policies (Optional)
```sql
-- Public Read Access
CREATE POLICY "User pictures are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'user-pictures');

-- Authenticated User Upload
CREATE POLICY "Users can upload user pictures" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-pictures');

-- Authenticated User Update
CREATE POLICY "Users can update user pictures" ON storage.objects
FOR UPDATE USING (bucket_id = 'user-pictures');

-- Authenticated User Delete
CREATE POLICY "Users can delete user pictures" ON storage.objects
FOR DELETE USING (bucket_id = 'user-pictures');
```

## Step 3: Run Database Migrations

Execute the following SQL in your Supabase SQL editor:

### Students Table Migration
```sql
-- Add picture_url column to students table
ALTER TABLE students 
ADD COLUMN picture_url TEXT;

-- Add comment to document the field
COMMENT ON COLUMN students.picture_url IS 'URL to the student profile picture stored in Supabase Storage';
```

### Users Table Creation and Migration
```sql
-- Create users table (run this first if you don't have a users table)
-- See create_users_table.sql for the complete table creation script

-- Or if you already have a users table, just add the picture_url column:
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS picture_url TEXT;

-- Add comment to document the field
COMMENT ON COLUMN users.picture_url IS 'URL to the user profile picture stored in Supabase Storage';
```

## Step 4: Verify Setup

1. Check that the `student-pictures` bucket exists in Storage
2. Check that the `user-pictures` bucket exists in Storage (if using user pictures)
3. Verify that the storage policies are active
4. Confirm that the `picture_url` column was added to the `students` table
5. Confirm that the `users` table exists and has the `picture_url` column

## Features Enabled

After completing this setup, the application will support:

### Student Pictures
- ✅ Uploading student profile pictures during student creation
- ✅ Updating student profile pictures when editing student information
- ✅ Automatic picture deletion when removing pictures
- ✅ Picture preview in forms
- ✅ Fallback to placeholder images when no picture is uploaded
- ✅ File type validation (images only)
- ✅ File size validation (5MB limit)

### User Pictures (Optional)
- ✅ Uploading user profile pictures during user creation
- ✅ Updating user profile pictures when editing user information
- ✅ Picture preview in user forms
- ✅ File type validation (images only)
- ✅ File size validation (5MB limit)

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**: Ensure the bucket name is exactly `student-pictures`
2. **"Policy not found" error**: Check that all storage policies are properly created
3. **Upload fails**: Verify that the storage policies allow INSERT operations
4. **Pictures not displaying**: Check that the SELECT policy is active and the bucket is public

### Testing Upload

To test the setup:
1. Create a new student with a picture
2. Edit an existing student and upload a picture
3. Verify pictures display correctly in the student list and cards
4. Create a new user with a profile picture
5. Edit an existing user and upload a profile picture
6. Verify user pictures display correctly in user management

## Security Considerations

- The `student-pictures` bucket is public, meaning anyone with the URL can access the images
- Consider implementing authentication checks if you need more restrictive access
- File uploads are limited to image types and 5MB size
- Users can only upload/update/delete pictures through the application interface

## Support

If you encounter issues with this setup, check:
1. Supabase project logs for errors
2. Browser console for client-side errors
3. Network tab for failed API requests
4. Storage bucket permissions and policies
