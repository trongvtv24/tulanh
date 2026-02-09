"use client";

// Main Notes Page - Tủ Lạnh Module
// Displays list of notes with search and tag filtering

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  FileText,
  Link2,
  RefreshCw,
  StickyNote,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import {
  getNotes,
  searchNotes as searchNotesAction,
} from "@/app/actions/notes";
import { getTagTree } from "@/app/actions/tags";
import type { NoteWithTags, TagNode } from "@/types/notes";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { TagTree } from "@/components/notes/TagTree";

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteWithTags[]>([]);
  const [tagTree, setTagTree] = useState<TagNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await getNotes({
        tagId: selectedTagId || undefined,
        limit: 100,
      });

      if (result.success && result.data) {
        setNotes(result.data);
      } else {
        toast.error(result.error || "Không thể tải dữ liệu");
      }
    } catch {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [user, selectedTagId]);

  // Fetch tag tree
  const fetchTagTree = useCallback(async () => {
    if (!user) return;

    try {
      const result = await getTagTree();
      if (result.success && result.data) {
        setTagTree(result.data);
      }
    } catch {
      console.error("Error fetching tag tree");
    }
  }, [user]);

  // Initial load - only fetch tag tree
  useEffect(() => {
    if (user) {
      fetchTagTree();
    }
    setLoading(false);
  }, [user, fetchTagTree]);

  // Search handler with debounce - only search when user types
  useEffect(() => {
    // Don't search if no query
    if (!user || !searchQuery.trim()) {
      if (!searchQuery.trim()) {
        setNotes([]); // Clear results when search is empty
      }
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await searchNotesAction(searchQuery);
        if (result.success && result.data) {
          setNotes(result.data);
        }
      } catch {
        toast.error("Lỗi tìm kiếm");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  // Fetch notes when tag filter changes
  useEffect(() => {
    if (selectedTagId && user) {
      fetchNotes();
    } else if (!selectedTagId && !searchQuery.trim()) {
      setNotes([]); // Clear when no filter
    }
  }, [selectedTagId, user, fetchNotes, searchQuery]);

  // Handle tag filter
  const handleTagClick = (tagId: string) => {
    setSelectedTagId((prev) => (prev === tagId ? null : tagId));
    setSearchQuery("");
  };

  // Handle new note
  const handleNewNote = () => {
    setEditingNoteId(null);
    setIsEditing(true);
  };

  // Handle edit note
  const handleEditNote = (noteId: string) => {
    setEditingNoteId(noteId);
    setIsEditing(true);
  };

  // Handle editor close
  const handleEditorClose = () => {
    setIsEditing(false);
    setEditingNoteId(null);
    fetchNotes();
    fetchTagTree();
  };

  // Stats
  const noteCount = notes.filter((n) => !n.is_url).length;
  const urlCount = notes.filter((n) => n.is_url).length;

  // Not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md text-center p-8">
          <StickyNote className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
          <h2 className="text-xl font-bold mb-2">
            Đăng nhập để sử dụng Tủ Lạnh
          </h2>
          <p className="text-muted-foreground">
            Lưu trữ kiến thức và URL của bạn một cách an toàn
          </p>
        </Card>
      </div>
    );
  }

  // Editor mode
  if (isEditing) {
    return (
      <NoteEditor
        noteId={editingNoteId}
        onClose={handleEditorClose}
        onSave={handleEditorClose}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
            <StickyNote className="h-6 w-6 text-blue-500" />
            Tủ Lạnh
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Lưu trữ kiến thức và URL với Markdown
          </p>
        </div>
        <Button onClick={handleNewNote} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {noteCount}
              </div>
              <div className="text-xs text-blue-500/80">Kiến thức</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Link2 className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-500">
                {urlCount}
              </div>
              <div className="text-xs text-green-500/80">Bookmarks</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm kiến thức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Tag Sidebar */}
        {tagTree.length > 0 && (
          <div className="w-48 shrink-0 hidden md:block">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tags</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <TagTree
                  tags={tagTree}
                  selectedTagId={selectedTagId}
                  onTagClick={handleTagClick}
                />
                {selectedTagId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => setSelectedTagId(null)}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notes List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-muted-foreground">
              {searchQuery
                ? `Kết quả tìm kiếm`
                : selectedTagId
                  ? `Lọc theo tag`
                  : `Tất cả kiến thức`}
              {` (${notes.length})`}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNotes}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin opacity-50" />
              <p>Đang tải...</p>
            </div>
          ) : notes.length === 0 ? (
            <Card className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
              {searchQuery.trim() ? (
                <>
                  <p className="text-muted-foreground">
                    Không tìm thấy kết quả nào
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thử từ khóa khác
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Nhập từ khóa để tìm kiếm kiến thức
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">hoặc</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleNewNote}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm kiến thức mới
                  </Button>
                </>
              )}
            </Card>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleEditNote(note.id)}
                  onRefresh={fetchNotes}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
