-- =============================================
-- COMMUNITY UPDATE & CONTENT LOCKING
-- =============================================

-- 1. Upsert Communities
INSERT INTO public.communities (slug, name, description, icon, required_level)
VALUES 
(
    'youtube', 
    'Youtube', 
    'Cộng đồng chia sẻ về Youtube: Kinh nghiệm, SEO, Content và phát triển kênh.', 
    'Youtube', 
    0
),
(
    'tricks-courses', 
    'Tricks và Khóa học', 
    'Chia sẻ các thủ thuật công nghệ và các khóa học bổ ích.', 
    'BookOpen', 
    0
)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description,
    icon = EXCLUDED.icon;

-- 2. Add Columns to Posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS min_level_to_view int DEFAULT 0;

-- 3. Update Existing Posts (Optional backfill)
-- We can set title to substring of content for existing posts if needed, 
-- but for now leaving NULL is fine or we can set it to "Untitled".
-- UPDATE public.posts SET title = substring(content from 1 for 50) || '...' WHERE title IS NULL;
