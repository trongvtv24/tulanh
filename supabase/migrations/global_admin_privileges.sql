-- =============================================
-- GLOBAL ADMIN PRIVILEGES
-- Admin: vutrongvtv24@gmail.com
-- =============================================

-- 1. Create a helper function to check if current user is global admin
-- Uses SECURITY DEFINER to access auth.users table
CREATE OR REPLACE FUNCTION public.is_global_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND email = 'vutrongvtv24@gmail.com'
    );
$$;

-- 2. Update Posts SELECT policy to include global admin
DROP POLICY IF EXISTS "Posts visibility simplified" ON public.posts;
CREATE POLICY "Posts visibility with global admin"
ON public.posts FOR SELECT
USING (
    public.is_global_admin() -- Global admin sees ALL posts
    OR auth.uid() = user_id -- Author sees their own
    OR status = 'approved' -- Public sees approved
    OR (status = 'pending' AND community_id IS NOT NULL AND public.is_community_admin_or_mod(community_id))
);

-- 3. Update Posts UPDATE policy to include global admin
DROP POLICY IF EXISTS "Posts update - fixed" ON public.posts;
CREATE POLICY "Posts update with global admin"
ON public.posts FOR UPDATE
USING (
    public.is_global_admin() -- Global admin can update ANY post
    OR auth.uid() = user_id 
    OR (community_id IS NOT NULL AND public.is_community_admin_or_mod(community_id))
);

-- 4. Update Posts DELETE policy to include global admin
DROP POLICY IF EXISTS "Posts delete - fixed" ON public.posts;
CREATE POLICY "Posts delete with global admin"
ON public.posts FOR DELETE
USING (
    public.is_global_admin() -- Global admin can delete ANY post
    OR auth.uid() = user_id 
    OR (community_id IS NOT NULL AND public.is_community_admin_or_mod(community_id))
);

-- 5. Also give global admin visibility to all community members
DROP POLICY IF EXISTS "Select community_members - non-recursive" ON public.community_members;
CREATE POLICY "Select community_members with global admin"
ON public.community_members FOR SELECT
USING (
    public.is_global_admin() -- Global admin sees all memberships
    OR user_id = auth.uid() 
    OR public.is_community_admin_or_mod(community_id)
);

-- 6. Global admin can manage all memberships
DROP POLICY IF EXISTS "Admins manage members - fixed" ON public.community_members;
CREATE POLICY "Manage members with global admin"
ON public.community_members FOR UPDATE
USING (
    public.is_global_admin() -- Global admin can manage ANY membership
    OR public.is_community_admin_or_mod(community_id)
);

-- 7. Global admin can delete any membership
CREATE POLICY "Delete members with global admin"
ON public.community_members FOR DELETE
USING (
    public.is_global_admin() -- Global admin can remove ANY member
    OR public.is_community_admin_or_mod(community_id)
);

-- 8. Add 'role' column to profiles if not exists (for UI to detect admin)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- 9. Set vutrongvtv24@gmail.com as admin in profiles table
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'vutrongvtv24@gmail.com';

-- Done! Global admin now has full control over all posts and members.
