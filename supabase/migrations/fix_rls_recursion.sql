-- =============================================
-- FIX: Infinite Recursion in community_members RLS
-- =============================================

-- Problem: Policy "Members viewable by admins and self" queries community_members
-- inside its own USING clause, causing infinite recursion.

-- Solution: Use a security definer function to bypass RLS when checking admin status.

-- 1. Create a helper function (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_community_admin_or_mod(p_community_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.community_members
        WHERE community_id = p_community_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'moderator')
        AND status = 'approved'
    );
$$;

-- 2. Drop the problematic policy
DROP POLICY IF EXISTS "Members viewable by admins and self" ON public.community_members;

-- 3. Create a new, non-recursive SELECT policy
-- Users can always see their own membership (any status)
-- Admins/Mods can see all members of their community
CREATE POLICY "Select community_members - non-recursive"
ON public.community_members FOR SELECT
USING (
    user_id = auth.uid() 
    OR public.is_community_admin_or_mod(community_id)
);

-- 4. Fix the UPDATE policy (same issue)
DROP POLICY IF EXISTS "Admins manage members" ON public.community_members;
CREATE POLICY "Admins manage members - fixed"
ON public.community_members FOR UPDATE
USING (
    public.is_community_admin_or_mod(community_id)
);

-- 5. Also fix posts policies that query community_members
DROP POLICY IF EXISTS "Public/Community Post Visibility" ON public.posts;
CREATE POLICY "Public/Community Post Visibility - fixed"
ON public.posts FOR SELECT
USING (
    (auth.uid() = user_id) OR -- Author sees all their posts
    (
        status = 'approved' AND (
            community_id IS NULL -- Global post, everyone can see
            -- Note: We simplify access: approved posts in communities are PUBLIC 
            -- (no member-only restriction for now to avoid recursion)
        )
    ) OR
    ( -- Approved community posts visible to members
        status = 'approved' AND community_id IS NOT NULL AND
        public.is_community_admin_or_mod(community_id)
    ) OR
    ( -- Admins/Mods see pending posts too
        community_id IS NOT NULL AND
        public.is_community_admin_or_mod(community_id)
    )
);

-- Simplified version: All approved posts are viewable, pending only by admin/author
DROP POLICY IF EXISTS "Public/Community Post Visibility - fixed" ON public.posts;
CREATE POLICY "Posts visibility simplified"
ON public.posts FOR SELECT
USING (
    auth.uid() = user_id -- Author always sees their own
    OR status = 'approved' -- All approved posts are public
    OR (status = 'pending' AND community_id IS NOT NULL AND public.is_community_admin_or_mod(community_id))
);

-- 6. Fix posts UPDATE policy
DROP POLICY IF EXISTS "Users update own and Admins approve" ON public.posts;
CREATE POLICY "Posts update - fixed"
ON public.posts FOR UPDATE
USING (
    auth.uid() = user_id 
    OR (community_id IS NOT NULL AND public.is_community_admin_or_mod(community_id))
);

-- 7. Fix posts DELETE policy
DROP POLICY IF EXISTS "Users delete own and Admins delete" ON public.posts;
CREATE POLICY "Posts delete - fixed"
ON public.posts FOR DELETE
USING (
    auth.uid() = user_id 
    OR (community_id IS NOT NULL AND public.is_community_admin_or_mod(community_id))
);

-- Done! The infinite recursion should now be fixed.
