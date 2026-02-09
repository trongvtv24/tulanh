# Plan: Tủ Lạnh (MarkNote) Module

**Created:** 2026-01-30 11:07  
**Status:** 🟡 In Progress  
**Type:** Feature Addition (Module Integration)  
**Complexity:** Medium  
**Estimated Time:** 10-15 working days

---

## 📌 Overview

**Tủ Lạnh** là module ghi chú tối giản được tích hợp vào Builder Ecosystem, cho phép user lưu trữ và tìm kiếm ghi chú/URL với Markdown và hashtag phân cấp.

### Core Features:

- ✍️ Markdown Editor với live preview
- 🏷️ Hashtag phân cấp (#work/project-a/task-1)
- 🔗 Auto-fetch URL metadata
- 🔍 Full-text search
- 🌓 Dark mode (kế thừa Deep Glass Theme)

### Integration Strategy:

- ✅ Kế thừa 80% infrastructure (Next.js, Supabase, Auth, UI)- ✅ Thêm 3 tables mới: `notes`, `tags`, `note_tags`
- ✅ Route mới: `/notes`
- ✅ Sidebar menu: "Tủ Lạnh" 📦

---

## 🛠️ Tech Stack

### Frontend:

- Framework: Next.js 16 App Router ✅ (Existing)
- Components: Shadcn/UI ✅ (Existing)
- Styling: TailwindCSS + Deep Glass ✅ (Existing)
- Markdown: `react-markdown` + `remark-gfm` ✅ (Existing)

### Backend:

- Database: Supabase PostgreSQL ✅ (Existing)
- Auth: Supabase Auth ✅ (Existing)
- Functions: Supabase Edge Function (URL metadata)

### No New Dependencies Required! 🎉

---

## 📋 Phases

| Phase | Name                       | Status      | Progress | Est. Time |
| ----- | -------------------------- | ----------- | -------- | --------- |
| 01    | Database Schema            | ✅ Complete | 100%     | 1 day     |
| 02    | URL Metadata Edge Function | ✅ Complete | 100%     | 1 day     |
| 03    | Backend - Server Actions   | ✅ Complete | 100%     | 2 days    |
| 04    | Frontend - Core UI         | ✅ Complete | 100%     | 3 days    |
| 05    | Frontend - Hashtag System  | ✅ Complete | 100%     | 2-3 days  |
| 06    | Frontend - Search          | ✅ Complete | 100%     | 1-2 days  |
| 07    | Integration & Testing      | ✅ Complete | 100%     | 2-3 days  |

**Total:** 7 phases | ~60 tasks | 12-15 days

---

## 🎯 Success Criteria

- [ ] User có thể tạo 10+ notes trong 1 ngày
- [ ] Search trả về kết quả < 1s
- [ ] Auto-save hoạt động 100%
- [ ] Tag tree render đúng cấu trúc
- [ ] URL metadata fetch success rate > 80%
- [ ] Mobile responsive

---

## ⚡ Quick Commands

- **Start Phase 1:** → Tôi sẽ hướng dẫn chi tiết
- **Check progress:** `/next`
- **Save context:** `/save-brain`

---

## 📦 Deliverables

### Phase 1 Output:

- Migration SQL file (`supabase/migrations/20260130_create_notes_tables.sql`)
- Run migration on Production

### Phase 2 Output:

- Edge Function (`supabase/functions/fetch-url-metadata/index.ts`)
- Deploy to Supabase

### Phase 3 Output:

- Server Actions (`src/app/actions/notes.ts`)
- Types (`src/types/notes.ts`)

### Phase 4 Output:

- Route files (`src/app/(main)/notes/page.tsx`, etc.)
- Components (`NoteList`, `NoteEditor`, `NoteCard`)

### Phase 5 Output:

- Hashtag components (`TagTree`, `TagAutocomplete`)
- Hashtag parsing utils

### Phase 6 Output:

- Search component (`NoteSearch`)
- Search function integration

### Phase 7 Output:

- Sidebar menu integration
- Routing setup
- E2E testing

---

## 🔗 Related Documents

- **BRIEF:** `docs/BRIEF_tulalanh.md`
- **Original Spec:** `BRIEF marknote Tu lanh.md`
- **Migration:** `supabase/migrations/20260130_create_notes_tables.sql` (to be created)

---

**Next:** Bắt đầu Phase 1 - Database Schema 🚀
