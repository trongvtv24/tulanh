import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { useLanguage } from "@/context/LanguageContext";
import { UI_Post } from "@/hooks/usePosts";
import { Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostContentProps {
  post: UI_Post;
  isLocked: boolean;
  minLevel: number;
  isEditing: boolean;
  editContent: string;
  setEditContent: (content: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onCancelEdit: () => void;
  displayContent: string;
}

export function PostContent({
  post,
  isLocked,
  minLevel,
  isEditing,
  editContent,
  setEditContent,
  isSaving,
  onSave,
  onCancelEdit,
  displayContent,
}: PostContentProps) {
  const { t } = useLanguage();

  if (isLocked) {
    return (
      <div className="space-y-3 p-4 pt-2">
        {/* Show title even when locked */}
        {post.title && (
          <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
        )}
        {/* Locked content notice */}
        <div className="relative rounded-md border border-dashed border-amber-500/30 bg-amber-500/5 p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-amber-700">
              Level {minLevel} Required
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t.community.levelRequired.replace("{level}", String(minLevel))}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-2">
      {post.title && (
        <h3 className="font-bold text-lg mb-2 leading-tight">{post.title}</h3>
      )}

      {isEditing ? (
        <div className="space-y-2 mb-3">
          <MarkdownEditor
            value={editContent}
            onChange={setEditContent}
            placeholder={t.feed.shareWhatYouLearned || "Share your thoughts..."}
            disabled={isSaving}
            minHeight="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              disabled={isSaving}
            >
              {t.common.cancel}
            </Button>
            <Button size="sm" onClick={onSave} disabled={isSaving}>
              {isSaving ? t.common.saving : t.common.save}
            </Button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none break-words mb-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {displayContent}
          </ReactMarkdown>
        </div>
      )}
      {post.image_url && (
        <div className="relative w-full rounded-md overflow-hidden bg-muted/20">
          <img
            src={post.image_url}
            alt="Post Image"
            loading="lazy"
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}
    </div>
  );
}
