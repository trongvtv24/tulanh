// Supabase Edge Function: fetch-url-metadata
// Description: Fetch Open Graph metadata (title, description) from a given URL
// Usage: POST /functions/v1/fetch-url-metadata { "url": "https://example.com" }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UrlMetadata {
  title: string;
  description: string;
  url: string;
  success: boolean;
}

// Parse HTML to extract Open Graph or fallback metadata
function extractMetadata(html: string, url: string): UrlMetadata {
  // Try Open Graph title first
  let title = "";
  let description = "";

  // OG Title
  const ogTitleMatch = html.match(
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
  );
  if (ogTitleMatch) {
    title = ogTitleMatch[1];
  }

  // Fallback to <title> tag
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1];
    }
  }

  // OG Description
  const ogDescMatch = html.match(
    /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
  );
  if (ogDescMatch) {
    description = ogDescMatch[1];
  }

  // Fallback to meta description
  if (!description) {
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    );
    if (descMatch) {
      description = descMatch[1];
    }
  }

  // Clean up HTML entities
  title = decodeHtmlEntities(title.trim());
  description = decodeHtmlEntities(description.trim());

  return {
    title: title || "Untitled",
    description: description || "",
    url: url,
    success: true,
  };
}

// Decode common HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Validate URL format
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { url } = await req.json();

    // Validate URL
    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL is required", success: false }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!isValidUrl(url)) {
      return new Response(
        JSON.stringify({ error: "Invalid URL format", success: false }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Fetch the URL with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MarkNote/1.0; +https://tulanh.online)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch URL: ${response.status}`,
          success: false,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get HTML content (limit to first 50KB to avoid memory issues)
    const html = await response.text();
    const truncatedHtml = html.substring(0, 50000);

    // Extract metadata
    const metadata = extractMetadata(truncatedHtml, url);

    return new Response(JSON.stringify(metadata), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle specific errors
    if (error.name === "AbortError") {
      return new Response(
        JSON.stringify({ error: "Request timeout", success: false }),
        {
          status: 504,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.error("Error fetching URL metadata:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch metadata",
        success: false,
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
