"use client";

// NoteEditor Component - Simple editor synced with other modules
// Supports both text knowledge and URL bookmarks

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Trash2,
  Link2,
  FileText,
  Eye,
  Edit3,
  Hash,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  fetchUrlMetadata,
} from "@/app/actions/notes";
import { getTagSuggestions } from "@/app/actions/tags";
import type { NoteWithTags, Tag } from "@/types/notes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteEditorProps {
  noteId: string | null;
  onClose: () => void;
  onSave: () => void;
}

export function NoteEditor({ noteId, onClose, onSave }: NoteEditorProps) {
  // State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUrl, setIsUrl] = useState(false);
  const [url, setUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlDescription, setUrlDescription] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const isNewNote = !noteId;

  // Load existing note
  useEffect(() => {
    if (noteId) {
      setLoading(true);
      getNote(noteId).then((result) => {
        if (result.success && result.data) {
          const note = result.data;
          setTitle(note.title);
          setContent(note.content || "");
          setIsUrl(note.is_url);
          setUrl(note.url || "");
          setUrlTitle(note.url_title || "");
          setUrlDescription(note.url_description || "");
          setTags(note.tags || []);
        } else {
          toast.error("Không thể tải dữ liệu");
          onClose();
        }
        setLoading(false);
      });
    }
  }, [noteId, onClose]);

  // Auto-save (debounced)
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    if (isNewNote && !title.trim() && !content.trim() && !url.trim()) {
      return; // Don't auto-save empty new notes
    }

    autoSaveTimer.current = setTimeout(async () => {
      await handleSave(true);
    }, 2000);
  }, [isNewNote, title, content, url]);

  // Trigger auto-save on content change
  useEffect(() => {
    if (!isNewNote) {
      triggerAutoSave();
    }
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [title, content, isNewNote, triggerAutoSave]);

  // URL detection
  useEffect(() => {
    const urlPattern = /^https?:\/\/[^\s]+$/;
    if (urlPattern.test(content.trim()) && !isUrl && isNewNote) {
      // Content is just a URL - suggest URL mode
      setIsUrl(true);
      setUrl(content.trim());
      setContent("");
      handleFetchUrl(content.trim());
    }
  }, [content, isUrl, isNewNote]);

  // Fetch URL metadata
  const handleFetchUrl = async (urlToFetch: string) => {
    if (!urlToFetch.trim()) return;

    setFetchingUrl(true);
    try {
      const metadata = await fetchUrlMetadata(urlToFetch);
      if (metadata.success) {
        setUrlTitle(metadata.title);
        setUrlDescription(metadata.description);
        if (!title) {
          setTitle(metadata.title);
        }
        toast.success("Đã lấy thông tin URL");
      } else {
        toast.error("Không thể lấy thông tin URL");
      }
    } catch {
      toast.error("Lỗi khi lấy thông tin URL");
    } finally {
      setFetchingUrl(false);
    }
  };

  // Tag input handling
  useEffect(() => {
    if (tagInput.length > 0) {
      const timer = setTimeout(async () => {
        const result = await getTagSuggestions(tagInput);
        if (result.success && result.data) {
          setTagSuggestions(result.data);
          setShowTagSuggestions(true);
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setTagSuggestions([]);
      setShowTagSuggestions(false);
    }
  }, [tagInput]);

  // Add tag
  const handleAddTag = (tagName: string) => {
    const normalizedName = tagName.trim().toLowerCase();
    if (!normalizedName) return;

    // Check if already exists
    if (tags.some((t) => t.name === normalizedName)) {
      toast.error("Tag đã tồn tại");
      return;
    }

    // Add as a partial tag (full tag will be created on save)
    setTags([
      ...tags,
      {
        id: `temp-${Date.now()}`,
        name: normalizedName,
        slug: normalizedName.replace(/\//g, "-"),
        user_id: "",
        parent_id: null,
        level: 0,
        created_at: new Date().toISOString(),
      },
    ]);
    setTagInput("");
    setShowTagSuggestions(false);
  };

  // Remove tag
  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
  };

  // Save note
  const handleSave = async (isAutoSave = false) => {
    if (!title.trim() && !content.trim() && !url.trim()) {
      if (!isAutoSave) {
        toast.error("Vui lòng nhập tiêu đề hoặc nội dung");
      }
      return;
    }

    setSaving(true);
    try {
      const tagNames = tags.map((t) => t.name);

      if (isNewNote) {
        const result = await createNote({
          title: title.trim() || "Untitled",
          content: content.trim(),
          is_url: isUrl,
          url: isUrl ? url.trim() : undefined,
          tags: tagNames,
        });

        if (result.success) {
          if (!isAutoSave) {
            toast.success("Đã lưu thành công");
            onSave();
          }
        } else {
          toast.error(result.error || "Không thể lưu");
        }
      } else {
        const result = await updateNote({
          id: noteId,
          title: title.trim(),
          content: content.trim(),
          is_url: isUrl,
          url: isUrl ? url.trim() : undefined,
          url_title: isUrl ? urlTitle : undefined,
          url_description: isUrl ? urlDescription : undefined,
          tags: tagNames,
        });

        if (result.success) {
          if (!isAutoSave) {
            toast.success("Đã lưu thành công");
          }
        } else {
          toast.error(result.error || "Không thể lưu");
        }
      }
    } catch {
      toast.error("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  // Delete note
  const handleDelete = async () => {
    if (!noteId) return;
    if (!confirm("Bạn có chắc muốn xóa mục này?")) return;

    const result = await deleteNote(noteId);
    if (result.success) {
      toast.success("Đã xóa thành công");
      onClose();
    } else {
      toast.error(result.error || "Không thể xóa");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex items-center gap-2">
          {!isNewNote && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu
          </Button>
        </div>
      </div>

      {/* Note Type Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={isUrl ? "outline" : "default"}
          size="sm"
          onClick={() => setIsUrl(false)}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Kiến thức
        </Button>
        <Button
          variant={isUrl ? "default" : "outline"}
          size="sm"
          onClick={() => setIsUrl(true)}
          className="gap-2"
        >
          <Link2 className="h-4 w-4" />
          Bookmark URL
        </Button>
      </div>

      {/* URL Section */}
      {isUrl && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => handleFetchUrl(url)}
                disabled={fetchingUrl || !url.trim()}
              >
                {fetchingUrl ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Lấy thông tin"
                )}
              </Button>
            </div>
            {urlTitle && (
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="font-medium text-sm">{urlTitle}</p>
                {urlDescription && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {urlDescription}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Title */}
      <Input
        placeholder="Tiêu đề..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg font-semibold"
      />

      {/* Tags */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Hash className="h-4 w-4 text-muted-foreground" />
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="gap-1">
                {tag.name}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <div className="relative flex-1 min-w-[120px]">
              <Input
                placeholder="Thêm tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                className="h-7 text-sm border-none shadow-none"
              />
              {showTagSuggestions && tagSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-10">
                  {tagSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleAddTag(suggestion.name)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      #{suggestion.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor/Preview */}
      {!isUrl && (
        <Card className="min-h-[400px]">
          <CardHeader className="py-2 px-4 border-b">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
            >
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="edit" className="gap-1 text-xs">
                  <Edit3 className="h-3 w-3" />
                  Viết
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1 text-xs">
                  <Eye className="h-3 w-3" />
                  Xem trước
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab}>
              <TabsContent value="edit" className="m-0">
                <Textarea
                  placeholder="Viết nội dung với Markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[350px] border-none rounded-none resize-none font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview" className="m-0 p-4 min-h-[350px]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Chưa có nội dung...
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Notes for URL mode */}
      {isUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Mô tả thêm (tùy chọn)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Thêm mô tả về URL này..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
