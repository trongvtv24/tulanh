# Phase 03-07: Implementation Phases Summary

Đây là tóm tắt các phase còn lại. Mỗi phase sẽ có file chi tiết riêng khi bắt đầu thực hiện.

---

## Phase 03: Backend - Server Actions (2 days)

### Objective:

Tạo Server Actions để CRUD notes và tags từ Frontend.

### Tasks:

- [ ] Create `src/app/actions/notes.ts`
  - `createNote(data)` → INSERT into notes
  - `updateNote(id, data)` → UPDATE notes
  - `deleteNote(id)` → DELETE notes
  - `getNotes(filters)` → SELECT with pagination
  - `getNote(id)` → SELECT single note

- [ ] Create `src/app/actions/tags.ts`
  - `getTags(userId)` → SELECT all user tags
  - `createTag(name, parentId)` → INSERT tag
  - `getTagTree(userId)` → Build hierarchical tree

- [ ] Create `src/types/notes.ts`
  - Type definitions: Note, Tag, NoteTag

### Files:

- `src/app/actions/notes.ts`
- `src/app/actions/tags.ts`
- `src/types/notes.ts`

---

## Phase 04: Frontend - Core UI (3 days)

### Objective:

Tạo UI cơ bản: Note list, Editor, Note card

### Tasks:

- [ ] Route `src/app/(main)/notes/page.tsx` → Note list
- [ ] Route `src/app/(main)/notes/[id]/page.tsx` → Note editor
- [ ] Component `NoteList.tsx` → Grid/list notes
- [ ] Component `NoteCard.tsx` → Preview note/URL
- [ ] Component `NoteEditor.tsx` → Markdown editor + preview
- [ ] Component `MarkdownPreview.tsx` → Render Markdown
- [ ] Auto-save logic (debounce 2s)

### Files:

- `src/app/(main)/notes/page.tsx`
- `src/app/(main)/notes/[id]/page.tsx`
- `src/components/notes/NoteList.tsx`
- `src/components/notes/NoteCard.tsx`
- `src/components/notes/NoteEditor.tsx`
- `src/components/notes/MarkdownPreview.tsx`

---

## Phase 05: Frontend - Hashtag System (2-3 days)

### Objective:

Implement hashtag parsing, tag tree, autocomplete

### Tasks:

- [ ] Utility `parseHashtags(content)` → Extract #tags
- [ ] Component `TagTree.tsx` → Hierarchical tag list
- [ ] Component `TagAutocomplete.tsx` → Type # → suggest
- [ ] Component `TagPill.tsx` → Display tag
- [ ] Hook `useTags.ts` → Manage tag state
- [ ] Filter notes by tag

### Files:

- `src/lib/utils/hashtags.ts`
- `src/components/notes/TagTree.tsx`
- `src/components/notes/TagAutocomplete.tsx`
- `src/components/notes/TagPill.tsx`
- `src/hooks/useTags.ts`

---

## Phase 06: Frontend - Search (1-2 days)

### Objective:

Full-text search với highlight results

### Tasks:

- [ ] Component `NoteSearch.tsx` → Search input
- [ ] Server Action `searchNotes(query)` → Full-text SQL
- [ ] Highlight search terms in results
- [ ] Search by title, content, hashtag
- [ ] Sort results by relevance

### Files:

- `src/components/notes/NoteSearch.tsx`
- `src/app/actions/notes.ts` (add searchNotes)
- `src/lib/utils/highlightSearch.ts`

---

## Phase 07: Integration & Testing (2-3 days)

### Objective:

Tích hợp vào Sidebar, routing, testing

### Tasks:

- [ ] Add "Tủ Lạnh" menu to Sidebar
  - File: `src/components/layout/Sidebar.tsx`
  - Icon: 📦 hoặc 🗄️
- [ ] Setup routing `/notes`
  - Layout: `src/app/(main)/notes/layout.tsx`

- [ ] Dark mode integration (kế thừa Deep Glass)

- [ ] Mobile responsive
  - Test on iPhone/Android
  - Tablet layout

- [ ] E2E Testing
  - Create note
  - Edit note
  - Delete note
  - Search
  - Tag filtering

- [ ] Performance optimization
  - Lazy load notes
  - Virtualize long lists
  - Optimize images

### Files:

- `src/components/layout/Sidebar.tsx`
- `src/app/(main)/notes/layout.tsx`
- Test files (if using Playwright/Cypress)

---

## ⏱️ Timeline Summary

| Phase              | Days | Cumulative |
| ------------------ | ---- | ---------- |
| 01 - Database      | 1    | 1 day      |
| 02 - Edge Function | 1    | 2 days     |
| 03 - Backend       | 2    | 4 days     |
| 04 - Core UI       | 3    | 7 days     |
| 05 - Hashtag       | 2-3  | 9-10 days  |
| 06 - Search        | 1-2  | 10-12 days |
| 07 - Integration   | 2-3  | 12-15 days |

**Total:** 12-15 working days

---

## 📊 Ready to Start?

Bạn muốn bắt đầu từ Phase nào?

**Gợi ý:** Bắt đầu Phase 01 (Database) ngay! 🚀
