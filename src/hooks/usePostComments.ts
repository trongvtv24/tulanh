import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { toast } from "sonner";

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user: {
        name: string;
        avatar: string;
    };
}

export function usePostComments(postId: string) {
    const supabase = createClient();
    const { user } = useSupabaseAuth();

    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Realtime subscription setup is tricky inside a hook if usage pattern varies.
    // For now we keep basic fetch and create logic.

    const fetchComments = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("comments")
            .select(`
        id, content, created_at,
        profiles (full_name, avatar_url)
      `)
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (!error && data) {
            setComments(data.map((c: any) => ({
                id: c.id,
                content: c.content,
                created_at: c.created_at,
                user: {
                    name: c.profiles?.full_name || "Anonymous",
                    avatar: c.profiles?.avatar_url || "",
                },
            })));
        }
        setIsLoading(false);
    };

    const createComment = async (content: string) => {
        if (!content.trim() || !user) return;
        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from("comments")
                .insert({
                    post_id: postId,
                    user_id: user.id,
                    content: content.trim(),
                })
                .select()
                .single();

            if (error) throw error;

            // Optimistic handling can be done by parent or here if we return data
            return {
                id: data.id,
                content: content,
                created_at: new Date().toISOString(),
                user: {
                    name: user.user_metadata.full_name || "Me",
                    avatar: user.user_metadata.avatar_url || "",
                }
            };
        } catch (error) {
            console.error("Failed to comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        comments,
        setComments,
        isLoading,
        isSubmitting,
        fetchComments,
        createComment
    };
}
