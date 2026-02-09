"use client";

import { useState, useEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { UI_Post } from "@/hooks/usePosts";
import { createClient } from "@/lib/supabase/client"; // Still needed for realtime
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLanguage } from "@/context/LanguageContext";
import { useGamification } from "@/context/GamificationContext";
import { isAdminUser } from "@/config/constants";
import { PostHeader } from "./post-card/PostHeader";
import { PostContent } from "./post-card/PostContent";
import { PostActions } from "./post-card/PostActions";
import { PostComments, Comment } from "./post-card/PostComments";
import { PostApprovalStatus } from "./post-card/PostApprovalStatus";

// New Hooks
import { usePostActions } from "@/hooks/usePostActions";
import { usePostComments } from "@/hooks/usePostComments";

interface PostCardProps {
  post: UI_Post;
  onToggleLike: (postId: string, currentStatus: boolean) => void;
  onDeletePost?: (postId: string) => Promise<void>;
  onBlockUser?: (userId: string) => Promise<void>;
}

export function PostCard({
  post,
  onToggleLike,
  onDeletePost,
  onBlockUser,
}: PostCardProps) {
  const { user } = useSupabaseAuth();
  const { t } = useLanguage();
  const { level } = useGamification();
  const isAdmin = isAdminUser(user?.email);
  const supabase = createClient();

  // State for UI display only
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localCommentsCount, setLocalCommentsCount] = useState(post.comments);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [displayContent, setDisplayContent] = useState(post.content);

  // 1. Actions Hook (Approve, Delete, Block, Update)
  const {
    isDeleted,
    isSaving,
    status: postStatus,
    approvalVotes,
    hasVotedApprove,
    fetchApprovalStats,
    handleVoteApprove,
    handleAdminAction,
    handleUpdatePost: actionUpdatePost,
    handleDeletePost: actionDeletePost,
    handleBlockUser: actionBlockUser
  } = usePostActions({
    postId: post.id,
    postStatus: post.status || 'approved',
  });

  // 2. Comments Hook (Fetch, Create)
  const {
    comments,
    setComments,
    isLoading: isLoadingComments,
    isSubmitting: isSubmittingComment,
    fetchComments,
    createComment
  } = usePostComments(post.id);

  // --- Effects & Handlers ---

  // Check locking status
  const minLevel = post.min_level_to_view || 0;
  const isAuthor = user?.id === post.user.id;
  const isLocked = minLevel > level && !isAuthor && !isAdmin;

  useEffect(() => {
    if (postStatus === "pending" && user) {
      fetchApprovalStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postStatus, user, post.id]);

  // Load comments when toggle open
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);

  // Realtime Comments (Local subscriptions logic kept here or moved to advanced hook later)
  useEffect(() => {
    const channel = supabase
      .channel(`public:comments:${post.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${post.id}` },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (payload: any) => {
          setLocalCommentsCount((prev) => prev + 1);
          if (showComments) {
            // Optimistic fetch for new comment user details
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("id", payload.new.user_id)
              .single();

            const newComment: Comment = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              user: {
                name: profile?.full_name || "Anonymous",
                avatar: profile?.avatar_url || "",
              }
            };

            setComments(prev => {
              if (prev.some(c => c.id === newComment.id)) return prev;
              return [...prev, newComment];
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id, showComments, supabase]);


  // Wrappers
  const onSaveEdit = async () => {
    const success = await actionUpdatePost(editContent);
    if (success) {
      setDisplayContent(editContent);
      setIsEditing(false);
    }
  };

  const onSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const newComment = await createComment(commentText);
    if (newComment) {
      setComments([...comments, newComment]);
      setCommentText("");
      setLocalCommentsCount(prev => prev + 1);
    }
  };

  // Conditionals
  if (postStatus === "rejected" && !isAdmin && user?.id !== post.user.id) return null;
  if (isDeleted) return null;

  return (
    <Card className="overflow-hidden border-border/60">
      {postStatus === "pending" && (
        <PostApprovalStatus
          approvalVotes={approvalVotes}
          isAdmin={isAdmin}
          hasVotedApprove={hasVotedApprove}
          onVoteApprove={handleVoteApprove}
          onAdminApprove={() => handleAdminAction("approve")}
          onAdminReject={() => handleAdminAction("reject")}
        />
      )}

      <PostHeader
        post={post}
        isAuthor={isAuthor}
        isAdmin={isAdmin}
        onEdit={() => setIsEditing(true)}
        onDelete={() => actionDeletePost(onDeletePost)}
        onBlockUser={() => actionBlockUser(post.user.id, onBlockUser)}
      />

      <PostContent
        post={post}
        isLocked={isLocked}
        minLevel={minLevel}
        isEditing={isEditing}
        editContent={editContent}
        setEditContent={setEditContent}
        isSaving={isSaving}
        onSave={onSaveEdit}
        onCancelEdit={() => setIsEditing(false)}
        displayContent={displayContent}
      />

      <CardFooter className="flex-col p-0">
        <PostActions
          likes={post.likes}
          commentsCount={localCommentsCount}
          isLiked={post.liked_by_user}
          onToggleLike={() => onToggleLike(post.id, post.liked_by_user)}
          onToggleComments={() => setShowComments(!showComments)}
          postId={post.id}
        />

        {showComments && (
          <PostComments
            comments={comments}
            isLoading={isLoadingComments}
            onSubmit={onSubmitComment}
            commentText={commentText}
            setCommentText={setCommentText}
            isSubmitting={isSubmittingComment}
            userAvatar={user?.user_metadata?.avatar_url}
          />
        )}
      </CardFooter>
    </Card>
  );
}
