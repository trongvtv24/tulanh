import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { toast } from "sonner";
import { updatePostAction } from "@/app/actions/post";
import { useLanguage } from "@/context/LanguageContext";

// Type definitions
export interface UsePostActionsProps {
    postId: string;
    postStatus: string;
}

export function usePostActions({ postId, postStatus }: UsePostActionsProps) {
    const supabase = createClient();
    const { user } = useSupabaseAuth();
    const { t } = useLanguage();

    const [isDeleted, setIsDeleted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState(postStatus);
    const [approvalVotes, setApprovalVotes] = useState(0);
    const [hasVotedApprove, setHasVotedApprove] = useState(false);

    // Approval Logic
    const fetchApprovalStats = async () => {
        const { count } = await supabase
            .from("post_approvals")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postId);

        setApprovalVotes(count || 0);

        if (user) {
            const { data } = await supabase
                .from("post_approvals")
                .select("id")
                .eq("post_id", postId)
                .eq("user_id", user.id)
                .single();
            setHasVotedApprove(!!data);
        }
    };

    const handleVoteApprove = async () => {
        if (!user || hasVotedApprove) return;
        const { error } = await supabase.from("post_approvals").insert({ post_id: postId, user_id: user.id });
        if (!error) {
            setHasVotedApprove(true);
            setApprovalVotes(prev => prev + 1);
            toast.success(t.admin.voteOk + " success!");
        } else {
            toast.error("Failed to vote");
        }
    };

    const handleAdminAction = async (action: "approve" | "reject") => {
        const newStatus = action === "approve" ? "approved" : "rejected";
        const { error } = await supabase.from("posts").update({ status: newStatus }).eq("id", postId);
        if (!error) {
            setStatus(newStatus);
            toast.success(`Post ${action}d successfully`);
        } else {
            toast.error("Action failed");
        }
    };

    // Update Logic
    const handleUpdatePost = async (content: string) => {
        if (!content.trim()) return;
        setIsSaving(true);
        try {
            await updatePostAction(postId, content);
            toast.success(t.toast.postCreated);
            return true;
        } catch (error) {
            console.error(error);
            toast.error("Lỗi cập nhật bài viết");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    // Delete Logic
    const handleDeletePost = async (customDeleteFn?: (id: string) => Promise<void>) => {
        if (customDeleteFn) {
            await customDeleteFn(postId);
            setIsDeleted(true);
            return;
        }
        const { error } = await supabase.from("posts").delete().eq("id", postId);
        if (!error) {
            setIsDeleted(true);
            toast.success(t.toast.postDeleted);
        } else {
            toast.error("Lỗi xóa bài");
        }
    };

    // Block Logic
    const handleBlockUser = async (targetUserId: string, customBlockFn?: (id: string) => Promise<void>) => {
        if (customBlockFn) {
            await customBlockFn(targetUserId);
            return;
        }
        const { error } = await supabase.from("profiles").update({ status: "blocked" }).eq("id", targetUserId);
        if (!error) toast.success("User blocked!");
        else toast.error("Failed to block user");
    };

    return {
        isDeleted,
        isSaving,
        status,
        approvalVotes,
        hasVotedApprove,
        fetchApprovalStats,
        handleVoteApprove,
        handleAdminAction,
        handleUpdatePost,
        handleDeletePost,
        handleBlockUser
    };
}
