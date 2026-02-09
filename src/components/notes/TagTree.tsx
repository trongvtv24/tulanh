"use client";

// TagTree Component - Hierarchical tag display
// Shows tags in a tree structure with note counts

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Hash, Folder } from "lucide-react";
import type { TagNode } from "@/types/notes";
import { cn } from "@/lib/utils";

interface TagTreeProps {
  tags: TagNode[];
  selectedTagId: string | null;
  onTagClick: (tagId: string) => void;
  level?: number;
}

export function TagTree({
  tags,
  selectedTagId,
  onTagClick,
  level = 0,
}: TagTreeProps) {
  return (
    <div className="space-y-0.5">
      {tags.map((tag) => (
        <TagTreeItem
          key={tag.id}
          tag={tag}
          selectedTagId={selectedTagId}
          onTagClick={onTagClick}
          level={level}
        />
      ))}
    </div>
  );
}

interface TagTreeItemProps {
  tag: TagNode;
  selectedTagId: string | null;
  onTagClick: (tagId: string) => void;
  level: number;
}

function TagTreeItem({
  tag,
  selectedTagId,
  onTagClick,
  level,
}: TagTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = tag.children && tag.children.length > 0;
  const isSelected = tag.id === selectedTagId;

  // Get display name (last part of path)
  const displayName = tag.name.split("/").pop() || tag.name;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors text-sm",
          isSelected
            ? "bg-primary/20 text-primary"
            : "hover:bg-secondary text-muted-foreground hover:text-foreground",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {/* Expand/Collapse button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="shrink-0 p-0.5 hover:bg-secondary rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4" /> // Spacer
        )}

        {/* Icon */}
        {hasChildren ? (
          <Folder
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              isExpanded ? "text-blue-500" : "",
            )}
          />
        ) : (
          <Hash className="h-3.5 w-3.5 shrink-0" />
        )}

        {/* Tag name */}
        <button
          onClick={() => onTagClick(tag.id)}
          className="flex-1 text-left truncate"
        >
          {displayName}
        </button>

        {/* Note count */}
        {tag.note_count > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground shrink-0">
            {tag.note_count}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <TagTree
          tags={tag.children}
          selectedTagId={selectedTagId}
          onTagClick={onTagClick}
          level={level + 1}
        />
      )}
    </div>
  );
}
