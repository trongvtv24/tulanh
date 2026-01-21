-- =============================================
-- JOURNAL ENTRIES TABLE
-- Personal journal for each user (private posts)
-- =============================================

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: ONLY owner can see their own journal entries (completely private)
CREATE POLICY "Users can view own journal entries"
ON public.journal_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal entries"
ON public.journal_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
ON public.journal_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
ON public.journal_entries FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_entries;

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at DESC);

-- Create storage bucket for journal images (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('journal-images', 'journal-images', true);
