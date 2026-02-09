import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Send } from "lucide-react";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface PostCommentsProps {
  comments: Comment[];
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  commentText: string;
  setCommentText: (text: string) => void;
  isSubmitting: boolean;
  userAvatar?: string;
}

export function PostComments({
  comments,
  isLoading,
  onSubmit,
  commentText,
  setCommentText,
  isSubmitting,
  userAvatar,
}: PostCommentsProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full border-t bg-background px-4 py-3 space-y-4">
      {/* Comment Logic */}
      <div className="space-y-3 pl-2 border-l-2 border-muted">
        {isLoading ? (
          <p className="text-xs text-muted-foreground">{t.common.loading}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs">
                  {comment.user.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(comment.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {t.comments.noComments}
          </p>
        )}
      </div>

      {/* Input */}
      {userAvatar ? (
        <form onSubmit={onSubmit} className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.feed.writeComment}
              className="flex-1 bg-muted/50 rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={!commentText.trim() || isSubmitting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-center text-muted-foreground">
          {t.comments.loginToComment}
        </p>
      )}
    </div>
  );
}
