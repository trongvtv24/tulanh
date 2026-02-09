"use server";

// Server Actions for Notes Module (Tủ Lạnh / MarkNote)

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  Note,
  NoteWithTags,
  Tag,
  CreateNoteInput,
  UpdateNoteInput,
  GetNotesParams,
  ActionResponse,
  UrlMetadata,
} from "@/types/notes";

// ============================================
// URL METADATA FETCHING (moved from Edge Function)
// ============================================

/**
 * Fetch metadata (title, description) from a URL
 */
export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return {
        title: "",
        description: "",
        url,
        success: false,
        error: "Invalid URL protocol",
      };
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MarkNote/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        title: "",
        description: "",
        url,
        success: false,
        error: `HTTP ${response.status}`,
      };
    }

    const html = await response.text();
    const truncatedHtml = html.substring(0, 50000);

    // Extract title
    let title = "";
    const ogTitleMatch = truncatedHtml.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogTitleMatch) {
      title = ogTitleMatch[1];
    } else {
      const titleMatch = truncatedHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1];
      }
    }

    // Extract description
    let description = "";
    const ogDescMatch = truncatedHtml.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (ogDescMatch) {
      description = ogDescMatch[1];
    } else {
      const descMatch = truncatedHtml.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
      );
      if (descMatch) {
        description = descMatch[1];
      }
    }

    // Decode HTML entities
    title = decodeHtmlEntities(title.trim()) || "Untitled";
    description = decodeHtmlEntities(description.trim());

    return { title, description, url, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { title: "", description: "", url, success: false, error: message };
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// ============================================
// NOTES CRUD
// ============================================

/**
 * Create a new note
 */
export async function createNote(
  input: CreateNoteInput,
): Promise<ActionResponse<Note>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Prepare note data
    const noteData: Partial<Note> = {
      user_id: user.id,
      title: input.title || "Untitled",
      content: input.content || "",
      is_url: input.is_url || false,
      url: input.url || null,
    };

    // If URL provided, fetch metadata
    if (input.is_url && input.url) {
      const metadata = await fetchUrlMetadata(input.url);
      if (metadata.success) {
        noteData.url_title = metadata.title;
        noteData.url_description = metadata.description;
        noteData.url_fetched_at = new Date().toISOString();
        // Use fetched title if no title provided
        if (!input.title || input.title === "Untitled") {
          noteData.title = metadata.title;
        }
      }
    }

    // Insert note
    const { data: note, error: insertError } = await supabase
      .from("notes")
      .insert(noteData)
      .select()
      .single();

    if (insertError) {
      console.error("Error creating note:", insertError);
      return { success: false, error: insertError.message };
    }

    // Handle tags if provided
    if (input.tags && input.tags.length > 0) {
      await syncNoteTags(note.id, user.id, input.tags);
    }

    revalidatePath("/notes");
    return { success: true, data: note };
  } catch (error) {
    console.error("Error in createNote:", error);
    return { success: false, error: "Failed to create note" };
  }
}

/**
 * Update an existing note
 */
export async function updateNote(
  input: UpdateNoteInput,
): Promise<ActionResponse<Note>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Prepare update data (only include provided fields)
    const updateData: Record<string, unknown> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.is_url !== undefined) updateData.is_url = input.is_url;
    if (input.url !== undefined) updateData.url = input.url;
    if (input.url_title !== undefined) updateData.url_title = input.url_title;
    if (input.url_description !== undefined)
      updateData.url_description = input.url_description;

    // Update note
    const { data: note, error: updateError } = await supabase
      .from("notes")
      .update(updateData)
      .eq("id", input.id)
      .eq("user_id", user.id) // Ensure user owns the note
      .select()
      .single();

    if (updateError) {
      console.error("Error updating note:", updateError);
      return { success: false, error: updateError.message };
    }

    // Handle tags if provided
    if (input.tags !== undefined) {
      await syncNoteTags(note.id, user.id, input.tags);
    }

    revalidatePath("/notes");
    revalidatePath(`/notes/${input.id}`);
    return { success: true, data: note };
  } catch (error) {
    console.error("Error in updateNote:", error);
    return { success: false, error: "Failed to update note" };
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting note:", deleteError);
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteNote:", error);
    return { success: false, error: "Failed to delete note" };
  }
}

/**
 * Get a single note by ID
 */
export async function getNote(
  noteId: string,
): Promise<ActionResponse<NoteWithTags>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get note
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .eq("user_id", user.id)
      .single();

    if (noteError) {
      return { success: false, error: noteError.message };
    }

    // Get tags for this note
    const { data: noteTags } = await supabase
      .from("note_tags")
      .select("tag_id")
      .eq("note_id", noteId);

    const tagIds = noteTags?.map((nt) => nt.tag_id) || [];

    let tags: Tag[] = [];
    if (tagIds.length > 0) {
      const { data: tagsData } = await supabase
        .from("tags")
        .select("*")
        .in("id", tagIds);
      tags = tagsData || [];
    }

    return { success: true, data: { ...note, tags } };
  } catch (error) {
    console.error("Error in getNote:", error);
    return { success: false, error: "Failed to get note" };
  }
}

/**
 * Get notes with pagination and filtering
 */
export async function getNotes(
  params: GetNotesParams = {},
): Promise<ActionResponse<NoteWithTags[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const {
      limit = 50,
      offset = 0,
      tagId,
      search,
      sortBy = "updated_at",
      sortOrder = "desc",
    } = params;

    let query = supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    // Filter by tag
    if (tagId) {
      const { data: noteIds } = await supabase
        .from("note_tags")
        .select("note_id")
        .eq("tag_id", tagId);

      if (noteIds && noteIds.length > 0) {
        query = query.in(
          "id",
          noteIds.map((n) => n.note_id),
        );
      } else {
        return { success: true, data: [] };
      }
    }

    // Search (simple LIKE for now, full-text later)
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: notes, error: notesError } = await query;

    if (notesError) {
      return { success: false, error: notesError.message };
    }

    // Get tags for all notes
    const noteIds = notes.map((n) => n.id);
    const { data: allNoteTags } = await supabase
      .from("note_tags")
      .select("note_id, tag_id")
      .in("note_id", noteIds);

    const tagIdsSet = new Set(allNoteTags?.map((nt) => nt.tag_id) || []);
    const { data: allTags } = await supabase
      .from("tags")
      .select("*")
      .in("id", Array.from(tagIdsSet));

    // Map tags to notes
    const notesWithTags: NoteWithTags[] = notes.map((note) => {
      const noteTagIds =
        allNoteTags
          ?.filter((nt) => nt.note_id === note.id)
          .map((nt) => nt.tag_id) || [];
      const tags = allTags?.filter((t) => noteTagIds.includes(t.id)) || [];
      return { ...note, tags };
    });

    return { success: true, data: notesWithTags };
  } catch (error) {
    console.error("Error in getNotes:", error);
    return { success: false, error: "Failed to get notes" };
  }
}

/**
 * Search notes with full-text search
 */
export async function searchNotes(
  query: string,
): Promise<ActionResponse<NoteWithTags[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    // Use PostgreSQL full-text search
    const { data: notes, error: searchError } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (searchError) {
      return { success: false, error: searchError.message };
    }

    // Get tags (reuse logic from getNotes)
    const noteIds = notes.map((n) => n.id);
    const { data: allNoteTags } = await supabase
      .from("note_tags")
      .select("note_id, tag_id")
      .in("note_id", noteIds);

    const tagIdsSet = new Set(allNoteTags?.map((nt) => nt.tag_id) || []);
    const { data: allTags } = await supabase
      .from("tags")
      .select("*")
      .in("id", Array.from(tagIdsSet));

    const notesWithTags: NoteWithTags[] = notes.map((note) => {
      const noteTagIds =
        allNoteTags
          ?.filter((nt) => nt.note_id === note.id)
          .map((nt) => nt.tag_id) || [];
      const tags = allTags?.filter((t) => noteTagIds.includes(t.id)) || [];
      return { ...note, tags };
    });

    return { success: true, data: notesWithTags };
  } catch (error) {
    console.error("Error in searchNotes:", error);
    return { success: false, error: "Failed to search notes" };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Sync note-tag relationships
 * Creates tags if they don't exist, then links to note
 */
async function syncNoteTags(
  noteId: string,
  userId: string,
  tagNames: string[],
): Promise<void> {
  const supabase = await createClient();

  // Remove existing note-tag links
  await supabase.from("note_tags").delete().eq("note_id", noteId);

  if (tagNames.length === 0) return;

  // Get or create tags
  const tagIds: string[] = [];
  for (const tagName of tagNames) {
    const tag = await getOrCreateTag(userId, tagName);
    if (tag) {
      tagIds.push(tag.id);
    }
  }

  // Create note-tag links
  if (tagIds.length > 0) {
    const noteTagsData = tagIds.map((tagId) => ({
      note_id: noteId,
      tag_id: tagId,
    }));
    await supabase.from("note_tags").insert(noteTagsData);
  }
}

/**
 * Get or create a tag by name
 */
async function getOrCreateTag(
  userId: string,
  tagName: string,
): Promise<Tag | null> {
  const supabase = await createClient();

  // Normalize tag name
  const name = tagName.trim().toLowerCase();
  const slug = name.replace(/\//g, "-").replace(/[^a-z0-9-]/g, "");
  const level = name.split("/").length - 1;

  // Check if tag exists
  const { data: existingTag } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", userId)
    .eq("name", name)
    .single();

  if (existingTag) {
    return existingTag;
  }

  // Create new tag
  const { data: newTag, error } = await supabase
    .from("tags")
    .insert({
      user_id: userId,
      name,
      slug,
      level,
      parent_id: null, // TODO: Handle parent relationships
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating tag:", error);
    return null;
  }

  return newTag;
}
