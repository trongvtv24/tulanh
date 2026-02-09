# Phase 01: Database Schema

**Status:** ⬜ Pending  
**Dependencies:** None  
**Estimated Time:** 1 day  
**Complexity:** Medium

---

## 🎯 Objective

Tạo database schema cho module Tủ Lạnh, bao gồm 3 tables mới:

1. **`notes`** - Lưu ghi chú và URL bookmarks
2. **`tags`** - Hashtag phân cấp
3. **`note_tags`** - Many-to-many relationship

---

## 📋 Requirements

### Functional:

- [ ] Table `notes` với columns: id, user_id, title, content, is_url, url metadata
- [ ] Table `tags` với hierarchical structure (parent_id)
- [ ] Table `note_tags` để liên kết notes ↔ tags
- [ ] RLS policies: User chỉ thấy notes/tags của mình
- [ ] Full-text search index cho notes
- [ ] Performance indexes

### Non-Functional:

- [ ] **Performance:** Query time < 500ms cho 1000+ notes
- [ ] **Security:** RLS policies strict, no data leakage
- [ ] **Scalability:** Support up to 10,000 notes/user

---

## 🛠️ Implementation Steps

### Step 1: Tạo Migration File

- [ ] Tạo file `supabase/migrations/20260130_create_notes_tables.sql`
- [ ] Include:
  - CREATE TABLE statements
  - Indexes
  - RLS policies
  - Updated_at trigger

### Step 2: Table `notes`

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  title TEXT NOT NULL DEFAULT '',
  content TEXT DEFAULT '',

  -- URL bookmark fields
  is_url BOOLEAN DEFAULT FALSE,
  url TEXT,
  url_title TEXT,
  url_description TEXT,
  url_fetched_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Step 3: Table `tags`

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Tag info
  name TEXT NOT NULL, -- Full path: work/project-a/task-1
  slug TEXT NOT NULL, -- Normalized: work-project-a-task-1
  parent_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 0, -- 0 = root, 1 = child, etc.

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, name)
);
```

### Step 4: Table `note_tags`

```sql
CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  PRIMARY KEY (note_id, tag_id)
);
```

### Step 5: Indexes

```sql
-- Notes indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_notes_is_url ON notes(is_url);

-- Tags indexes
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_parent_id ON tags(parent_id);
CREATE INDEX idx_tags_slug ON tags(slug);

-- Full-text search
CREATE INDEX idx_notes_search
ON notes USING GIN(to_tsvector('english',
  COALESCE(title, '') || ' ' || COALESCE(content, '')
));
```

### Step 6: RLS Policies

```sql
-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can view own notes"
ON notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
ON notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
ON notes FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
ON notes FOR DELETE
USING (auth.uid() = user_id);

-- Similar policies for tags and note_tags
```

### Step 7: Trigger cho updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### Step 8: Run Migration

- [ ] Review SQL file
- [ ] Run on Supabase Dashboard
- [ ] Verify tables created
- [ ] Test RLS policies

---

## 📁 Files to Create/Modify

- `supabase/migrations/20260130_create_notes_tables.sql` - Migration file
- `.brain/session.json` - Update với task progress

---

## ✅ Test Criteria

### Manual Tests:

- [ ] Tables exist: `SELECT * FROM notes, tags, note_tags LIMIT 1;`
- [ ] RLS works: Try query as different user
- [ ] Indexes exist: `\d+ notes` trong psql
- [ ] Full-text search works: Test `to_tsvector`

### Data Integrity:

- [ ] Cannot insert note without user_id
- [ ] Deleting user cascades to notes/tags
- [ ] Deleting note cascades to note_tags

---

## 📝 Notes

### Design Decisions:

1. **Hierarchical Tags:** Lưu full path trong `name` để dễ query
   - Pros: Simple, no recursive queries
   - Cons: Rename parent = update all children

2. **URL Metadata:** Separate fields thay vì JSON
   - Pros: Dễ search, index
   - Cons: More columns

3. **Timestamps:** Include `url_fetched_at` để track freshness

### Edge Cases:

- Tag không có parent (root level) → `parent_id = NULL`
- Note không có content (chỉ URL) → `content = ''`
- Tag bị xóa → CASCADE delete note_tags relationships

---

## 🔗 Next Phase

**Phase 02:** URL Metadata Edge Function  
→ `phase-02-url-metadata-function.md`

---

**Ready to execute?** Let me know when to create the migration SQL file! 🚀
