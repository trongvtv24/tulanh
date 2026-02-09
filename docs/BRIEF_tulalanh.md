# 💡 BRIEF: Tủ Lạnh (MarkNote) - Module Integration

**Ngày tạo:** 2026-01-30  
**Brainstorm cùng:** User  
**Loại sản phẩm:** Web App Module (tích hợp vào Builder Ecosystem)  
**Tech Stack:** Next.js 16 + Supabase (kế thừa từ Builder Ecosystem)

---

## 🎯 INTEGRATION STRATEGY

**MarkNote ("Tủ Lạnh")** sẽ là một **MODULE** trong **Builder Ecosystem** hiện tại:

```
Builder Ecosystem (tulanh.online)
│
├── 🏠 Community Feed          (Existing)
├── 🎮 Gamification            (Existing)
├── 💬 Direct Messaging        (Existing)
├── ✅ Todos & Journal         (Existing)
└── 🆕 TỦ LẠNH (MarkNote)      ← NEW MODULE
    │
    ├── Route: /notes
    ├── Menu: "Tủ Lạnh" in Sidebar
    ├── Auth: Shared (Supabase Auth)
    ├── Database: +3 new tables (notes, tags, note_tags)
    └── UI: Minimalist layout (kế thừa Deep Glass Theme)
```

### ✅ Benefits of Integration:

- 🚀 **Faster**: 80% infrastructure sẵn có (Next.js, Supabase, Auth, UI)
- 💰 **Cost-effective**: 1 Supabase project, 1 deployment
- 👥 **Better UX**: User đã auth, không phải login lại
- 🔧 **Maintainable**: 1 codebase, 1 tech stack

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT

User cần một nơi lưu trữ:

- 📝 **Ghi chú** (ideas, notes, snippets)
- 🔗 **URL bookmarks** (articles, resources)

**Khó khăn hiện tại:**

- ❌ Không có cách tổ chức rõ ràng
- ❌ Không tìm kiếm được nhanh
- ❌ Phải dùng app thứ 3 (Notion, Obsidian) - phức tạp và tách biệt

---

## 2. GIẢI PHÁP

**Tủ Lạnh** = Nơi lưu trữ ghi chú/URL **đơn giản, nhanh, ngay trong Builder Ecosystem**

### Core Features:

- ✍️ **Markdown Editor**: Viết ghi chú với Markdown + live preview
- 🏷️ **Hashtag Hierarchical**: Phân loại theo cấu trúc (#work/project-a/task-1)
- 🔗 **URL Auto-fetch**: Paste link → tự động lấy title + description
- 🔍 **Full-text Search**: Tìm nhanh theo title/content/hashtag
- 🌓 **Dark Mode**: Kế thừa Deep Glass Theme

---

## 3. ĐỐI TƯỢNG SỬ DỤNG

- **Primary:** User của Builder Ecosystem (đã có account)
- **Use Case:**
  - Lưu ý tưởng nhanh khi browse community feed
  - Bookmark articles/resources từ posts
  - Tổ chức kiến thức cá nhân

---

## 4. MVP FEATURES (Phase 1)

### 🔐 Authentication:

- [x] Kế thừa Supabase Auth hiện tại
- [x] Auto-detect logged-in user

### 📝 Notes - Core:

- [ ] Tạo ghi chú mới (title + Markdown content)
- [ ] Sửa ghi chú
- [ ] Xóa ghi chú (confirm dialog)
- [ ] Auto-save (debounce 2s)
- [ ] Markdown editor + live preview (split view)
- [ ] Display created_at/updated_at

### 🔗 URL Handling:

- [ ] Detect URL in content
- [ ] Paste URL → auto-fetch metadata (title + description)
- [ ] Display as card preview
- [ ] Save as is_url=true note

### 🏷️ Hashtag System:

- [ ] Parse hashtags from content (#tag1 #parent/child)
- [ ] Tag autocomplete (type # → suggest existing tags)
- [ ] Sidebar tag tree view
- [ ] Click tag → filter notes by tag
- [ ] Count notes per tag

### 🔍 Search:

- [ ] Full-text search (title + content)
- [ ] Search by hashtag
- [ ] Highlight search results

### 🎨 UI:

- [ ] Sidebar: Tag Tree + Search
- [ ] Main Area: Note List + Editor
- [ ] Dark mode (kế thừa Deep Glass)
- [ ] Responsive (PC + Mobile)

---

## 5. TECH ARCHITECTURE

### Frontend:

- **Framework:** Next.js 16 App Router ✅ (Existing)
- **Routing:** `/notes` (new route)
- **Components:** Shadcn/UI ✅ (Existing)
- **Styling:** TailwindCSS + Deep Glass ✅ (Existing)
- **Markdown:**
  - Editor: `react-markdown` (hoặc CodeMirror)
  - Parser: `remark-gfm` ✅ (Existing)

### Backend:

- **Database:** Supabase PostgreSQL ✅ (Existing)
- **Auth:** Supabase Auth ✅ (Existing)
- **RLS:** Row Level Security (user chỉ thấy notes của mình)

### New Dependencies:

```json
{
  "react-markdown": "^9.0.0", // Existing
  "remark-gfm": "^4.0.0" // Existing
  // Không cần thêm package mới!
}
```

### URL Metadata Fetching:

**Option:** Supabase Edge Function (serverless)

```typescript
// supabase/functions/fetch-url-metadata/index.ts
// Input: URL
// Output: { title, description }
```

---

## 6. DATABASE SCHEMA

### New Tables (3):

```sql
-- 1. Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  is_url BOOLEAN DEFAULT FALSE,
  url TEXT,
  url_title TEXT,
  url_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tags (hierarchical)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Full path: work/project-a/task-1
  parent_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- 3. Note-Tag Relationship (many-to-many)
CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_parent_id ON tags(parent_id);

-- Full-text Search
CREATE INDEX idx_notes_search
ON notes USING GIN(to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- RLS Policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own tags" ON tags
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own note_tags" ON note_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid()
    )
  );
```

---

## 7. UI/UX INTEGRATION

### Sidebar Menu Addition:

```
Current Sidebar:
├── Cộng đồng
├── Bảng xếp hạng
├── Tin nhắn
├── Việc cần làm
└── 🆕 Tủ Lạnh  ← NEW
```

### Route Structure:

```
/notes              → List all notes
/notes/new          → Create new note
/notes/[id]         → View/Edit note
/notes/tag/[tagId]  → Filter by tag
```

### Layout:

```
┌─────────────────────────────────────────────────────┐
│  Builder Ecosystem Header (Existing)               │
├──────────────┬──────────────────────────────────────┤
│  Sidebar     │  NOTES AREA                         │
│  (Existing)  │                                      │
│              │  ┌────────────────────────────────┐ │
│  🏠 Cộng đồng │  │  [Search notes...]            │ │
│  🏆 Leaderboard│  └────────────────────────────────┘ │
│  💬 Messages │                                      │
│  ✅ Todos    │  📝 My Notes (12)                   │
│  📦 Tủ Lạnh  │  ┌────────────────────────────────┐ │
│    └─ My Notes│  │ Title: Project Ideas          │ │
│    └─ Tags    │  │ #work/ideas                   │ │
│               │  │ Updated: 2 mins ago            │ │
│  🏷️ Tags:     │  └────────────────────────────────┘ │
│  📂 work (5)  │  ┌────────────────────────────────┐ │
│    └─ ideas   │  │ Title: React Tutorial         │ │
│  📂 personal  │  │ 🔗 https://react.dev          │ │
│               │  │ Updated: 1 hour ago            │ │
│               │  └────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────┘
```

---

## 8. IMPLEMENTATION PLAN (Summary)

### ⏱️ Estimated Time: **10-15 days** (faster vì tận dụng sẵn có)

**Breakdown:**

1. **Database Setup** (1 day): Create tables, RLS policies
2. **Supabase Edge Function** (1 day): URL metadata fetcher
3. **UI Components** (3-4 days): Note list, editor, tag tree
4. **Hashtag Logic** (2-3 days): Parse, autocomplete, tree build
5. **Search** (1-2 days): Full-text search integration
6. **Integration** (1 day): Add to sidebar, routing
7. **Testing & Polish** (2-3 days): Bug fixes, UX tweaks

---

## 9. PHASE 2+ FEATURES (Future)

- [ ] Markdown toolbar
- [ ] Tag management (rename, merge, delete)
- [ ] Advanced search (filters, saved searches)
- [ ] Export notes (JSON, Markdown ZIP)
- [ ] Share notes (public link)
- [ ] Backlinks (bidirectional links between notes)
- [ ] Graph view (visualize connections)

---

## 10. SUCCESS CRITERIA (MVP)

- [ ] User có thể tạo 10+ notes trong 1 ngày
- [ ] Search trả về kết quả < 1s
- [ ] Auto-save 100% reliable
- [ ] Tag tree render đúng cấu trúc
- [ ] URL metadata fetch success rate > 80%
- [ ] Mobile responsive hoạt động tốt

---

## 11. NEXT STEPS

### ✅ Brainstorm Complete

- [x] Xác định integration strategy
- [x] Thiết kế database schema sơ bộ
- [x] Ước tính timeline

### 🎯 Ready for `/plan`:

Chạy `/plan` để tạo:

- ✅ Database migration SQL chi tiết
- ✅ API endpoints design (Server Actions)
- ✅ UI component breakdown
- ✅ Task list implementation

---

**🎉 BRIEF HOÀN THÀNH! Ready to `/plan`** 🚀
