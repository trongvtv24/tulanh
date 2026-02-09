"use client";

// NoteCard Component - Display single note preview
// Shows title, content preview, tags, and metadata

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Link2, Trash2, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { deleteNote } from "@/app/actions/notes";
import type { NoteWithTags } from "@/types/notes";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface NoteCardProps {
  note: NoteWithTags;
  onClick: () => void;
  onRefresh: () => void;
}

export function NoteCard({ note, onClick, onRefresh }: NoteCardProps) {
  // Format date
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), {
    addSuffix: true,
    locale: vi,
  });

  // Preview content (first 100 chars)
  const contentPreview = note.content
    ? note.content.substring(0, 150).replace(/[#*`_\[\]]/g, "") +
      (note.content.length > 150 ? "..." : "")
    : "";

  // Handle delete
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Bạn có chắc muốn xóa mục này?")) return;

    const result = await deleteNote(note.id);
    if (result.success) {
      toast.success("Đã xóa thành công");
      onRefresh();
    } else {
      toast.error(result.error || "Không thể xóa mục này");
    }
  };

  // Handle URL click
  const handleUrlClick = (e: React.MouseEvent) => {
    if (note.is_url && note.url) {
      e.stopPropagation();
      window.open(note.url, "_blank");
    }
  };

  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`shrink-0 p-2 rounded-lg ${note.is_url ? "bg-green-500/10" : "bg-blue-500/10"}`}
          >
            {note.is_url ? (
              <Link2 className="h-5 w-5 text-green-500" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {note.title || "Untitled"}
            </h3>

            {/* URL Info */}
            {note.is_url && note.url && (
              <button
                onClick={handleUrlClick}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-1 transition-colors"
              >
                <span className="truncate max-w-[200px]">
                  {new URL(note.url).hostname}
                </span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </button>
            )}

            {/* URL Description */}
            {note.is_url && note.url_description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {note.url_description}
              </p>
            )}

            {/* Content Preview (for non-URL notes) */}
            {!note.is_url && contentPreview && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {contentPreview}
              </p>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    #{tag.name}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
