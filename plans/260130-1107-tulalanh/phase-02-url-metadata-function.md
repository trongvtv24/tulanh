# Phase 02: URL Metadata Edge Function

**Status:** ⬜ Pending  
**Dependencies:** Phase 01 (Database)  
**Estimated Time:** 1 day  
**Complexity:** Medium

---

## 🎯 Objective

Tạo Supabase Edge Function để fetch metadata (title, description) từ URL khi user paste link vào ghi chú.

---

## 📋 Requirements

### Functional:

- [ ] Fetch Open Graph metadata từ URL
- [ ] Fallback về `<title>` tag nếu không có OG
- [ ] Timeout sau 10s
- [ ] Handle errors gracefully

### Non-Functional:

- [ ] Response time < 5s
- [ ] Support CORS
- [ ] Rate limiting: 100 requests/minute/user

---

## 🛠️ Implementation Steps

### Step 1: Create Edge Function

```bash
supabase functions new fetch-url-metadata
```

### Step 2: Implement Logic

```typescript
// supabase/functions/fetch-url-metadata/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

serve(async (req) => {
  const { url } = await req.json();

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const title =
      doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
      doc.querySelector("title")?.textContent ||
      "Untitled";

    const description =
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") ||
      doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
      "";

    return new Response(JSON.stringify({ title, description }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
```

### Step 3: Deploy

```bash
supabase functions deploy fetch-url-metadata
```

### Step 4: Test

```bash
curl -X POST https://PROJECT_REF.supabase.co/functions/v1/fetch-url-metadata \
  -H "Authorization: Bearer ANON_KEY" \
  -d '{"url": "https://react.dev"}'
```

---

## ✅ Test Criteria

- [ ] Fetch OG metadata thành công
- [ ] Handle URL invalid
- [ ] Handle timeout (>10s)
- [ ] Handle website chặn scraping

---

## 📁 Files to Create

- `supabase/functions/fetch-url-metadata/index.ts`
- `supabase/functions/fetch-url-metadata/deno.json` (config)

---

**Next:** Phase 03 - Backend Server Actions
