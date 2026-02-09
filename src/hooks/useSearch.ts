import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { uuidToShort } from "@/lib/uuid";

export interface SearchResult {
    type: 'profile' | 'post';
    id: string;
    title: string;
    subtitle?: string;
    avatar?: string;
    url: string;
}

interface ProfileSearchRow {
    id: string;
    full_name: string;
    avatar_url: string;
}

interface PostSearchRow {
    id: string;
    content: string;
    created_at: string;
    profiles: { full_name: string } | null;
}

export function useSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const search = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);

            // 1. Search Users
            const { data: users } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .ilike('full_name', `%${query}%`)
                .limit(5);

            // 2. Search Posts (Search in both title and content)
            const { data: posts } = await supabase
                .from('posts')
                .select('id, title, content, created_at, profiles(full_name)')
                .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
                .limit(5);

            const userResults: SearchResult[] = (users || []).map((u: Record<string, unknown>) => ({
                type: 'profile' as const,
                id: u.id as string,
                title: u.full_name as string,
                subtitle: "Member",
                avatar: u.avatar_url as string,
                url: `/profile/${u.id}`
            }));

            const postResults: SearchResult[] = (posts || []).map((p: Record<string, unknown>) => {
                const profiles = p.profiles as Record<string, unknown> | null;
                const postTitle = p.title as string;
                const postContent = p.content as string;

                // Use post title needed, fallback to content snippet
                let displayTitle = postTitle;
                if (!displayTitle) {
                    displayTitle = `${profiles?.full_name || 'Anonymous'}: ${postContent.substring(0, 30)}...`;
                }

                return {
                    type: 'post' as const,
                    id: p.id as string,
                    title: displayTitle,
                    subtitle: new Date(p.created_at as string).toLocaleDateString(),
                    url: `/post/${uuidToShort(p.id as string)}`
                };
            });

            setResults([...userResults, ...postResults]);
            setLoading(false);
        };

        const timeoutId = setTimeout(search, 300); // 300ms debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    return { query, setQuery, results, loading };
}
