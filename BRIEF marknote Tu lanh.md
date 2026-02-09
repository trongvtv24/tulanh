# 💡 BRIEF: MarkNote

**Ngày tạo:** 2026-01-30
**Brainstorm cùng:** User
**Loại sản phẩm:** Web Application
**Tech Stack:** Supabase (Backend/Database) + Modern Web Frontend

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT

User có nhiều bài viết và URL cần lưu trữ, nhưng gặp khó khăn trong việc:

- **Tổ chức nội dung:** Không có cách phân loại rõ ràng, khó tìm lại khi cần
- **Tìm kiếm:** Không thể tìm kiếm nhanh theo chủ đề hoặc từ khóa
- **Định dạng:** Cần hỗ trợ Markdown để viết nội dung có cấu trúc
- **Truy cập đa thiết bị:** Cần truy cập từ cả PC và mobile

Hiện tại, các giải pháp sẵn có:

- **Obsidian:** Quá phức tạp, cần học nhiều, sync tốn phí
- **Notion:** Không tốt cho Markdown thuần, tag không phân cấp tốt
- **Bear Notes:** Chỉ cho Apple, không có web version
- **Google Keep/Evernote:** Không hỗ trợ Markdown, tag đơn giản

---

## 2. GIẢI PHÁP ĐỀ XUẤT

**MarkNote** là một web app ghi chú tối giản, tập trung vào:

### Core Value Proposition:

> "Lưu trữ và tìm kiếm ghi chú/URL một cách đơn giản với Markdown và hashtag phân cấp"

### Cách hoạt động:

1. User tạo ghi chú với nội dung Markdown hoặc paste URL
2. Gắn hashtag phân cấp để phân loại (ví dụ: #công-việc/dự-án-A/task-1)
3. Tìm kiếm nhanh theo nội dung, tiêu đề, hoặc hashtag
4. Truy cập mọi lúc, mọi nơi qua web browser

### Đặc điểm nổi bật:

- ✅ **Markdown thuần túy:** Viết và preview Markdown real-time
- ✅ **Hashtag phân cấp:** Tổ chức theo cấu trúc cây (#parent/child/grandchild)
- ✅ **URL-friendly:** Tự động fetch metadata (title, description) khi paste link
- ✅ **Tìm kiếm mạnh:** Full-text search trong tiêu đề, nội dung, và hashtag
- ✅ **UI tối giản:** Không phân tán, tập trung vào nội dung
- ✅ **Dark mode:** Bảo vệ mắt khi làm việc ban đêm

---

## 3. ĐỐI TƯỢNG SỬ DỤNG

- **Primary:** Chính User (personal knowledge management)
- **Secondary:** Có thể mở rộng cho người dùng khác sau này

### User Persona:

- Người cần lưu trữ nhiều thông tin (bài viết, URL, ý tưởng)
- Thích Markdown để viết nội dung có cấu trúc
- Cần phân loại và tìm kiếm nhanh
- Sử dụng cả PC và mobile
- Ưu tiên sự đơn giản hơn tính năng phức tạp

---

## 4. NGHIÊN CỨU THỊ TRƯỜNG

### Đối Thủ Chính:

| App            | Điểm Mạnh                                                                         | Điểm Yếu                                                                   | Lesson Learned                                                   |
| -------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Obsidian**   | • Markdown thuần`<br>`• Tag phân cấp`<br>`• Tìm kiếm mạnh`<br>`• Plugin ecosystem | • Phức tạp cho người mới`<br>`• Sync tốn phí`<br>`• Desktop-first          | → Học: Tag syntax (#parent/child)`<br>`→ Tránh: Over-engineering |
| **Notion**     | • UI đẹp`<br>`• Database mạnh`<br>`• Collaboration                                | • Không Markdown thuần`<br>`• Tag không phân cấp`<br>`• Phụ thuộc platform | → Học: URL preview card`<br>`→ Tránh: Quá nhiều tính năng        |
| **Bear Notes** | • UI tối giản đẹp`<br>`• Tag phân cấp`<br>`• Tìm kiếm tốt                         | • Chỉ Apple`<br>`• Không web                                               | → Học: Minimalist UI`<br>`→ Học: Tag autocomplete                |
| **Logseq**     | • Open source`<br>`• Markdown + outliner                                          | • UI phức tạp`<br>`• Learning curve cao                                    | → Tránh: Quá nhiều concept mới                                   |

### Điểm Khác Biệt Của MarkNote:

1. **🎯 Đơn giản & Tập trung**
   - Không cố làm "all-in-one" như Notion
   - Chỉ làm tốt 1 việc: Lưu + Tìm ghi chú/URL
   - UI tối giản, không phân tán

2. **🌐 Web-first, Open Data**
   - Không lock-in vào platform
   - Data lưu Supabase (PostgreSQL) → export dễ dàng
   - Truy cập mọi thiết bị qua browser

3. **🔗 URL-friendly**
   - Tự động fetch metadata cho URL (title, description)
   - Preview đẹp cho link
   - Phân biệt rõ giữa ghi chú text và URL bookmark

---

## 5. TÍNH NĂNG

### 🚀 MVP - PHASE 1 (Bắt buộc có):

#### Authentication:

- [x] Đăng ký/Đăng nhập (email + password) - Supabase Auth
- [x] Đăng xuất
- [ ] ~~Quên mật khẩu~~ → Phase 2

#### Ghi Chú - Core:

- [x] Tạo ghi chú mới (tiêu đề + nội dung Markdown)
- [x] Sửa ghi chú
- [x] Xóa ghi chú (có confirm dialog)
- [x] Tự động lưu (auto-save sau 2s không gõ)
- [x] Hiển thị ngày tạo/sửa cuối
- [x] Markdown editor + live preview (split view)
- [ ] ~~Markdown toolbar~~ → User gõ Markdown thuần

#### URL Handling:

- [x] Phát hiện URL trong nội dung
- [x] Tạo ghi chú từ URL (paste link → tự động fetch metadata)
- [x] Fetch title + description (Open Graph protocol)
- [x] Hiển thị preview card cho URL
- [ ] ~~Thumbnail~~ → Phase 2 (tốn bandwidth)

#### Hashtag - Core:

- [x] Gắn hashtag vào ghi chú (nhiều hashtag/1 ghi chú)
- [x] Hashtag phân cấp (#work/project-a/task-1)
- [x] Tag autocomplete (gõ # → gợi ý tag có sẵn)
- [x] Sidebar hiển thị tag tree (cấu trúc cây)
- [x] Click tag → filter ghi chú theo tag
- [x] Đếm số ghi chú/tag
- [ ] ~~Đổi tên/xóa/gộp tag~~ → Phase 2

#### Tìm Kiếm:

- [x] Tìm kiếm toàn văn (tiêu đề + nội dung)
- [x] Tìm theo hashtag (click tag hoặc search)
- [x] Highlight kết quả tìm kiếm
- [ ] ~~Tìm kiếm nâng cao, saved searches~~ → Phase 2

#### Hiển Thị:

- [x] List view (danh sách ghi chú)
- [x] Sắp xếp (mới nhất, cũ nhất)
- [x] Responsive design (PC + Mobile)
- [ ] ~~Grid view, pin, favorite, archive~~ → Phase 2

#### UI:

- [x] **Dark mode + Light mode** (toggle)
- [x] Sidebar (tag tree + search)
- [x] Editor (Markdown với syntax highlighting)
- [x] Preview pane (live preview)
- [x] Responsive layout
- [ ] ~~Focus mode, màu sắc tag~~ → Phase 2

---

### 🎁 PHASE 2 - Nice-to-have (3-6 tháng sau):

#### UX Improvements:

- [ ] Markdown toolbar (bold, italic, link, code...)
- [ ] Grid view (card layout)
- [ ] Ghim ghi chú (pin to top)
- [ ] Đánh dấu sao (favorite)
- [ ] Archive ghi chú cũ
- [ ] Trash bin (khôi phục ghi chú đã xóa 30 ngày)
- [ ] Focus mode (ẩn sidebar, fullscreen editor)
- [ ] Font size adjustment

#### Tag Management:

- [ ] Đổi tên tag (auto-update tất cả ghi chú)
- [ ] Xóa tag (với cảnh báo)
- [ ] Gộp tag (merge 2 tag thành 1)
- [ ] Màu sắc cho tag (custom hoặc auto)

#### Search & Organization:

- [ ] Tìm kiếm nâng cao (theo ngày, theo loại)
- [ ] Lịch sử tìm kiếm
- [ ] Saved searches (lưu query thường dùng)
- [ ] Sort theo nhiều tiêu chí

#### URL Enhancements:

- [ ] Fetch thumbnail cho URL
- [ ] Lưu snapshot nội dung trang (web archive)

#### Account Management:

- [ ] Quên mật khẩu (reset via email)
- [ ] Profile (tên, avatar)
- [ ] Đổi mật khẩu
- [ ] Xóa tài khoản

---

### 🌟 PHASE 3 - Advanced (6-12 tháng sau):

- [ ] Export/Import (JSON, Markdown files, ZIP)
- [ ] Thống kê (dashboard: số ghi chú, tag phổ biến, activity heatmap)
- [ ] Keyboard shortcuts (Vim-style hoặc custom)
- [ ] Browser extension (quick save URL)
- [ ] Share ghi chú (public link, read-only)
- [ ] **Backlink** (ghi chú liên kết với nhau) ← **NOTED cho tương lai**
- [ ] Graph view (visualize mối quan hệ giữa ghi chú)
- [ ] Collaboration (share workspace với người khác)

---

### 💭 PHASE 4+ - AI/Future (Nếu có nhu cầu):

- [ ] AI gợi ý hashtag (dựa trên nội dung)
- [ ] AI tóm tắt nội dung dài
- [ ] AI phân loại tự động
- [ ] Semantic search (tìm kiếm theo ý nghĩa, không chỉ từ khóa)

---

## 6. KIẾN TRÚC KỸ THUẬT SƠ BỘ

### Tech Stack:

#### Frontend:

- **Framework:** Vite + React (hoặc vanilla HTML/CSS/JS nếu muốn đơn giản)
- **Styling:** Vanilla CSS (tối giản, không dùng framework)
- **Markdown:**
  - Editor: CodeMirror hoặc textarea thuần
  - Parser: `marked.js` hoặc `markdown-it`
- **State Management:** React Context hoặc Zustand (nếu dùng React)

#### Backend/Database:

- **Supabase:**
  - PostgreSQL database
  - Authentication (email/password)
  - Row Level Security (RLS) - mỗi user chỉ thấy ghi chú của mình
  - Full-text search (built-in PostgreSQL)
  - Real-time subscriptions (optional cho auto-sync)

#### URL Metadata Fetching:

- **Option 1:** Supabase Edge Function (serverless)
- **Option 2:** Third-party API (linkpreview.net, microlink.io)
- **Option 3:** Self-hosted parser (cheerio + Open Graph)

### Database Schema (Sơ bộ):

```sql
-- Users (Supabase Auth tự quản lý)

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- Markdown content
  is_url BOOLEAN DEFAULT FALSE,
  url TEXT, -- Nếu là URL bookmark
  url_title TEXT, -- Fetched title
  url_description TEXT, -- Fetched description
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Full path: work/project-a/task-1
  parent_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Note-Tag relationship (many-to-many)
CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_parent_id ON tags(parent_id);

-- Full-text search
CREATE INDEX idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || content));
```

### UI Layout (Wireframe mô tả):

```
┌─────────────────────────────────────────────────────────┐
│  [MarkNote Logo]  [Search...]  [New Note] [Dark/Light] │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  SIDEBAR     │  EDITOR AREA                            │
│              │                                          │
│  📁 All Notes│  ┌────────────────────────────────────┐ │
│  🔍 Search   │  │ Title: [...................]       │ │
│              │  │                                    │ │
│  TAGS:       │  │ Tags: #work #project-a            │ │
│  📂 work (5) │  │                                    │ │
│    └ proj-a  │  ├─────────────┬──────────────────────┤ │
│  📂 personal │  │  MARKDOWN   │   PREVIEW            │ │
│  📂 reading  │  │             │                      │ │
│              │  │  # Heading  │   Heading            │ │
│  [+ New Tag] │  │  - List     │   • List             │ │
│              │  │             │                      │ │
│              │  └─────────────┴──────────────────────┘ │
│              │                                          │
│              │  [Save] [Delete]                        │
└──────────────┴──────────────────────────────────────────┘
```

---

## 7. ƯỚC TÍNH SƠ BỘ

### Độ Phức Tạp: **Trung Bình**

#### Phần Dễ:

- ✅ CRUD ghi chú (Create, Read, Update, Delete)
- ✅ Supabase setup (có template sẵn)
- ✅ Markdown rendering (thư viện có sẵn)
- ✅ Authentication (Supabase Auth)

#### Phần Trung Bình:

- 🟡 Hashtag phân cấp (cần logic parse và build tree)
- 🟡 Tag autocomplete (cần query real-time)
- 🟡 Full-text search (Supabase có sẵn nhưng cần config)
- 🟡 URL metadata fetching (cần Edge Function hoặc API)

#### Phần Khó (nếu làm):

- 🔴 Backlink (Phase 3 - cần parse Markdown links)
- 🔴 Graph view (Phase 3 - visualization phức tạp)
- 🔴 Real-time collaboration (Phase 3+ - conflict resolution)

### Thời Gian Ước Tính (MVP):

- **Setup project + Supabase:** 1-2 ngày
- **Authentication UI:** 1 ngày
- **CRUD ghi chú + Markdown editor:** 2-3 ngày
- **Hashtag system (parse, tree, autocomplete):** 3-4 ngày
- **Search functionality:** 2 ngày
- **URL metadata fetching:** 2 ngày
- **UI/UX polish + Dark mode:** 2-3 ngày
- **Testing + bug fixes:** 2-3 ngày

**Tổng: 15-20 ngày làm việc** (nếu làm full-time)

### Rủi Ro Kỹ Thuật:

1. **URL Metadata Fetching:**
   - **Vấn đề:** Một số website chặn scraping, không có Open Graph tags
   - **Giải pháp:** Fallback về title từ `<title>` tag, hoặc để user tự nhập

2. **Full-text Search Performance:**
   - **Vấn đề:** Khi có hàng nghìn ghi chú, search có thể chậm
   - **Giải pháp:** Supabase PostgreSQL có GIN index, tối ưu tốt. Nếu vẫn chậm, dùng Algolia/Meilisearch

3. **Hashtag Parsing:**
   - **Vấn đề:** User có thể gõ sai format (#tag/with space)
   - **Giải pháp:** Validate và sanitize tag input, gợi ý format đúng

4. **Mobile UX:**
   - **Vấn đề:** Split view (editor + preview) khó hiển thị trên mobile
   - **Giải pháp:** Mobile dùng tab switching (Edit/Preview), PC dùng split

---

## 8. DESIGN PRINCIPLES

### UI/UX Guidelines:

1. **Minimalism First:**
   - Ít button, ít menu
   - Mọi thứ trong tầm tay (sidebar + editor)
   - Không popup/modal không cần thiết

2. **Focus on Content:**
   - Editor chiếm phần lớn màn hình
   - Sidebar có thể thu gọn
   - Không quảng cáo, không distraction

3. **Speed:**
   - Auto-save nhanh (debounce 2s)
   - Search instant (as-you-type)
   - Load time < 2s

4. **Accessibility:**
   - Dark mode cho mắt
   - Keyboard shortcuts cho power users
   - Responsive cho mọi thiết bị

### Color Palette (Gợi ý):

**Light Mode:**

- Background: `#FFFFFF`
- Sidebar: `#F7F7F7`
- Text: `#1A1A1A`
- Accent: `#3B82F6` (blue)
- Border: `#E5E5E5`

**Dark Mode:**

- Background: `#1A1A1A`
- Sidebar: `#0F0F0F`
- Text: `#E5E5E5`
- Accent: `#60A5FA` (lighter blue)
- Border: `#2A2A2A`

---

## 9. SUCCESS METRICS (Sau khi launch)

### MVP Success Criteria:

- [ ] User có thể tạo 10+ ghi chú trong 1 ngày
- [ ] Tìm kiếm trả về kết quả < 1s
- [ ] Auto-save hoạt động 100% (không mất data)
- [ ] Mobile responsive hoạt động tốt
- [ ] Dark mode không có bug UI

### Long-term Metrics (Phase 2+):

- [ ] User retention > 70% sau 1 tháng
- [ ] Average notes/user > 50
- [ ] Search usage > 30% sessions
- [ ] Mobile traffic > 40%

---

## 10. BƯỚC TIẾP THEO

### ✅ Đã Hoàn Thành:

- [x] Brainstorm ý tưởng
- [x] Research thị trường
- [x] Xác định MVP features
- [x] Tạo BRIEF document

### 🎯 Next Steps:

**Option 1: Chạy `/plan` ngay** (Recommended)
→ Em sẽ tạo:

- Database schema chi tiết
- API endpoints design
- UI wireframes/mockups
- Task breakdown (implementation plan)

**Option 2: Chạy `/visualize` trước**
→ Em sẽ thiết kế UI/UX trước, sau đó mới code

**Option 3: Chạy `/init` để setup project**
→ Em sẽ tạo folder structure, install dependencies, setup Supabase

---

## 📌 NOTES & DECISIONS LOG

### Quyết Định Quan Trọng:

1. **Dark mode ưu tiên vào MVP** (User request)
2. **Backlink để Phase 3** (noted cho tương lai)
3. **URL chỉ fetch title + description, không fetch thumbnail** (MVP đơn giản)
4. **Không dùng Markdown toolbar** (User gõ Markdown thuần)
5. **Web-first, không làm mobile app native** (tiết kiệm thời gian)

### Questions to Resolve Later:

- [ ] Có giới hạn số lượng ghi chú/user không? (Supabase free tier)
- [ ] Có cần rate limiting cho URL fetching không?
- [ ] Có cho phép public sharing ghi chú không? (Phase 2/3)

---

**🎉 BRIEF HOÀN THÀNH!**

Bạn đã sẵn sàng chuyển sang bước tiếp theo chưa? Gõ:

- `/plan` - Để thiết kế chi tiết (database, API, tasks)
- `/visualize` - Để thiết kế UI/UX trước
- `/init` - Để setup project ngay

Hoặc nếu cần sửa gì trong Brief, cứ nói em nhé! 🚀
