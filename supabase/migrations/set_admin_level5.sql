-- Set Level 5 (Rồng Đỏ - Max Rank) cho Admin account
-- Run this in Supabase SQL Editor

-- Update level and XP for admin account
UPDATE public.profiles
SET 
    level = 5,
    xp = 1000,
    role = 'admin'
WHERE email = 'vutrongvtv24@gmail.com';

-- Verify the update
SELECT id, email, full_name, level, xp, role 
FROM public.profiles 
WHERE email = 'vutrongvtv24@gmail.com';
