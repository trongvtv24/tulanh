-- Create a bucket for images if it doesn't exist (idempotent usually requires extension, but we'll focus on policies here)
-- Note: You can't create buckets easily in pure SQL migrations without pg_net or extensions sometimes, 
-- but we can set policies assuming the bucket 'images' exists (which it should for the app to work).

-- 1. Policy for VIEWING images (Public Read)
-- Drop existing policy to avoid conflict
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Give me images" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- 2. Policy for UPLOADING images (Authenticated users only)
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "LoggedIn Upload" ON storage.objects;

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'images' 
    -- Optional: Limit folder structure or size here if needed
);

-- 3. Policy for UPDATING/DELETING (Only owner)
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;

-- Owners can update their own files
CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' AND (auth.uid() = owner) );

-- Owners can delete their own files
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' AND (auth.uid() = owner) );
