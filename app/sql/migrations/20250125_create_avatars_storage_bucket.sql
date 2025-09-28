-- Create avatars storage bucket for profile images
-- This migration sets up storage for user profile images

-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to avatar images
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Allow authenticated users to upload their own avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'profiles'
);

-- Policy: Allow users to update their own avatar files
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'profiles'
);

-- Policy: Allow users to delete their own avatar files
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'profiles'
);

-- Optional: Create a function to clean up old avatar files when a user updates their profile
CREATE OR REPLACE FUNCTION delete_old_avatar()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old avatar file from storage when profile image URL changes
  IF OLD.profile_image_url IS NOT NULL
     AND NEW.profile_image_url IS DISTINCT FROM OLD.profile_image_url
     AND OLD.profile_image_url LIKE '%/storage/v1/object/public/avatars/%' THEN

    -- Extract file path from URL
    DECLARE
      file_path TEXT;
    BEGIN
      file_path := substring(OLD.profile_image_url from '/avatars/(.*)');

      -- Delete the file from storage
      PERFORM storage.delete_object('avatars', file_path);
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the update
      RAISE NOTICE 'Failed to delete old avatar file: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically clean up old avatar files
DROP TRIGGER IF EXISTS on_profile_avatar_updated ON profiles;
CREATE TRIGGER on_profile_avatar_updated
  AFTER UPDATE OF profile_image_url ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION delete_old_avatar();