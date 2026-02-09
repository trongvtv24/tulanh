// Types for Notes Module (Tủ Lạnh / MarkNote)

// ============================================
// DATABASE TYPES (match Supabase schema)
// ============================================

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_url: boolean;
  url: string | null;
  url_title: string | null;
  url_description: string | null;
  url_fetched_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string; // Full path: work/project-a/task-1
  slug: string; // Normalized: work-project-a-task-1
  parent_id: string | null;
  level: number;
  created_at: string;
}

export interface NoteTag {
  note_id: string;
  tag_id: string;
  created_at: string;
}

// ============================================
// FRONTEND TYPES (extended for UI)
// ============================================

export interface NoteWithTags extends Note {
  tags: Tag[];
}

export interface TagNode extends Tag {
  children: TagNode[];
  note_count: number;
}

// ============================================
// INPUT TYPES (for Server Actions)
// ============================================

export interface CreateNoteInput {
  title: string;
  content?: string;
  is_url?: boolean;
  url?: string;
  tags?: string[]; // Array of tag names (e.g., ["work", "work/project-a"])
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  is_url?: boolean;
  url?: string;
  url_title?: string;
  url_description?: string;
  tags?: string[];
}

export interface GetNotesParams {
  limit?: number;
  offset?: number;
  tagId?: string;
  search?: string;
  sortBy?: "updated_at" | "created_at" | "title";
  sortOrder?: "asc" | "desc";
}

export interface CreateTagInput {
  name: string; // Full path
  parent_id?: string;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface UrlMetadata {
  title: string;
  description: string;
  url: string;
  success: boolean;
  error?: string;
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type NoteFilter = "all" | "notes" | "urls";

export interface SearchResult {
  notes: NoteWithTags[];
  total: number;
  query: string;
}
