"use server";

// Server Actions for Tags Module (Tủ Lạnh / MarkNote)

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  Tag,
  TagNode,
  CreateTagInput,
  ActionResponse,
} from "@/types/notes";

// ============================================
// TAGS CRUD
// ============================================

/**
 * Get all tags for the current user
 */
export async function getTags(): Promise<ActionResponse<Tag[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (tagsError) {
      return { success: false, error: tagsError.message };
    }

    return { success: true, data: tags || [] };
  } catch (error) {
    console.error("Error in getTags:", error);
    return { success: false, error: "Failed to get tags" };
  }
}

/**
 * Get tags as a hierarchical tree with note counts
 */
export async function getTagTree(): Promise<ActionResponse<TagNode[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get all tags
    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (tagsError) {
      return { success: false, error: tagsError.message };
    }

    // Get note counts per tag
    const { data: noteTags } = await supabase
      .from("note_tags")
      .select("tag_id");

    // Count notes per tag
    const tagCounts: Record<string, number> = {};
    noteTags?.forEach((nt) => {
      tagCounts[nt.tag_id] = (tagCounts[nt.tag_id] || 0) + 1;
    });

    // Build tree structure
    const tree = buildTagTree(tags || [], tagCounts);

    return { success: true, data: tree };
  } catch (error) {
    console.error("Error in getTagTree:", error);
    return { success: false, error: "Failed to get tag tree" };
  }
}

/**
 * Create a new tag
 */
export async function createTag(
  input: CreateTagInput,
): Promise<ActionResponse<Tag>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Normalize tag name
    const name = input.name.trim().toLowerCase();
    const slug = name.replace(/\//g, "-").replace(/[^a-z0-9-]/g, "");
    const level = name.split("/").length - 1;

    // Check if tag already exists
    const { data: existingTag } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", user.id)
      .eq("name", name)
      .single();

    if (existingTag) {
      return { success: false, error: "Tag already exists" };
    }

    // Handle parent relationship
    let parentId = input.parent_id || null;
    if (!parentId && name.includes("/")) {
      // Auto-detect parent from name
      const parentName = name.split("/").slice(0, -1).join("/");
      const { data: parentTag } = await supabase
        .from("tags")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", parentName)
        .single();

      if (parentTag) {
        parentId = parentTag.id;
      }
    }

    // Create tag
    const { data: tag, error: createError } = await supabase
      .from("tags")
      .insert({
        user_id: user.id,
        name,
        slug,
        level,
        parent_id: parentId,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating tag:", createError);
      return { success: false, error: createError.message };
    }

    revalidatePath("/notes");
    return { success: true, data: tag };
  } catch (error) {
    console.error("Error in createTag:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

/**
 * Delete a tag (and all child tags)
 */
export async function deleteTag(tagId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete tag (CASCADE will handle note_tags and child tags)
    const { error: deleteError } = await supabase
      .from("tags")
      .delete()
      .eq("id", tagId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting tag:", deleteError);
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteTag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}

/**
 * Rename a tag
 */
export async function renameTag(
  tagId: string,
  newName: string,
): Promise<ActionResponse<Tag>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const name = newName.trim().toLowerCase();
    const slug = name.replace(/\//g, "-").replace(/[^a-z0-9-]/g, "");
    const level = name.split("/").length - 1;

    const { data: tag, error: updateError } = await supabase
      .from("tags")
      .update({ name, slug, level })
      .eq("id", tagId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error renaming tag:", updateError);
      return { success: false, error: updateError.message };
    }

    revalidatePath("/notes");
    return { success: true, data: tag };
  } catch (error) {
    console.error("Error in renameTag:", error);
    return { success: false, error: "Failed to rename tag" };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build hierarchical tree from flat tag list
 */
function buildTagTree(
  tags: Tag[],
  tagCounts: Record<string, number>,
): TagNode[] {
  // Group tags by their parent path
  const tagMap: Record<string, TagNode> = {};
  const rootTags: TagNode[] = [];

  // First pass: create TagNode for each tag
  tags.forEach((tag) => {
    tagMap[tag.name] = {
      ...tag,
      children: [],
      note_count: tagCounts[tag.id] || 0,
    };
  });

  // Second pass: build hierarchy based on name paths
  tags.forEach((tag) => {
    const tagNode = tagMap[tag.name];

    if (tag.name.includes("/")) {
      // Has parent - find it
      const parentName = tag.name.split("/").slice(0, -1).join("/");
      const parentNode = tagMap[parentName];

      if (parentNode) {
        parentNode.children.push(tagNode);
      } else {
        // Parent doesn't exist (orphan), add to root
        rootTags.push(tagNode);
      }
    } else {
      // Root level tag
      rootTags.push(tagNode);
    }
  });

  // Sort children recursively
  const sortChildren = (nodes: TagNode[]): TagNode[] => {
    return nodes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((node) => ({
        ...node,
        children: sortChildren(node.children),
      }));
  };

  return sortChildren(rootTags);
}

/**
 * Get tag suggestions for autocomplete
 */
export async function getTagSuggestions(
  query: string,
): Promise<ActionResponse<Tag[]>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", user.id)
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true })
      .limit(10);

    if (tagsError) {
      return { success: false, error: tagsError.message };
    }

    return { success: true, data: tags || [] };
  } catch (error) {
    console.error("Error in getTagSuggestions:", error);
    return { success: false, error: "Failed to get tag suggestions" };
  }
}
