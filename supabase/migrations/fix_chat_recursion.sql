-- Fix Infinite Recursion in Chat System

-- 1. Drop old tables/policies if they exist to start fresh
DROP POLICY IF EXISTS "Users can view conversations they are part of" ON conversations;
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON direct_messages;
DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON direct_messages;

-- 2. Create Helper Function to avoid Recursion
-- This function runs with elevated privileges (SECURITY DEFINER) to check membership without triggering RLS
CREATE OR REPLACE FUNCTION is_conversation_participant(c_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM conversation_participants 
        WHERE conversation_id = c_id 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-apply Policies using the Helper Function

-- Conversations: Can see if you are a participant
CREATE POLICY "view_my_conversations" ON conversations
    FOR SELECT USING ( is_conversation_participant(id) );

-- Participants: Can see participants of conversations you belong to
CREATE POLICY "view_conversation_participants" ON conversation_participants
    FOR SELECT USING ( is_conversation_participant(conversation_id) );

-- Messages: Can see messages of conversations you belong to
CREATE POLICY "view_conversation_messages" ON direct_messages
    FOR SELECT USING ( is_conversation_participant(conversation_id) );

-- Messages: Can insert if you are a participant AND sender is you
CREATE POLICY "insert_conversation_messages" ON direct_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id 
        AND is_conversation_participant(conversation_id)
    );

-- 4. Clean up any old "max_participants" table (it was a table, not a view)
DROP TABLE IF EXISTS max_participants CASCADE;
