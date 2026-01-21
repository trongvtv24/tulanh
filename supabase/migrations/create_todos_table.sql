-- =============================================
-- TODO LIST TABLE
-- Personal todo list for each user
-- =============================================

-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only owner can see and manage their todos
CREATE POLICY "Users can view own todos"
ON public.todos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos"
ON public.todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
ON public.todos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
ON public.todos FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON public.todos(created_at DESC);
