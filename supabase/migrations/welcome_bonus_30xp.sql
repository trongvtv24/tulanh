-- =============================================
-- WELCOME BONUS: Give new users 30 XP
-- =============================================

-- Update handle_new_user function to give 30 XP welcome bonus
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, xp, level)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        30,  -- Welcome bonus XP
        1    -- Starting level
    );
    RETURN new;
END;
$$;

-- DONE: New users will now start with 30 XP instead of 0
