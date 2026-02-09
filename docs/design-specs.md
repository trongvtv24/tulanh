# Design Specifications: Builder Ecosystem (Tủ Lạnh)

## 🎨 Theme: "Deep Glass" (Dark Mode First)

A modern, developer-centric aesthetic combining deep backgrounds with glassmorphism effects for depth.

### Color Palette

| Name              | Hex       | Usage                                  |
| ----------------- | --------- | -------------------------------------- |
| **Background**    | `#09090b` | Main app background (Zinc-950)         |
| **Surface**       | `#18181b` | Cards, Sidebar (Zinc-900 with opacity) |
| **Surface Hover** | `#27272a` | Interactive elements hover             |
| **Primary**       | `#6366f1` | Indigo-500 (Actions, Active Tabs)      |
| **Secondary**     | `#10b981` | Emerald-500 (Success, Gamification)    |
| **Accent**        | `#f59e0b` | Amber-500 (Gold/VIP elements)          |
| **Text**          | `#fafafa` | Primary headings                       |
| **Text Muted**    | `#a1a1aa` | Secondary text, descriptions           |
| **Border**        | `#27272a` | Subtle dividers                        |

## 🏗️ Layout Structure

### 1. Left Sidebar (Navigation)

- **Width:** 250px (Fixed)
- **Style:** Clean vertical list. Active 2px left border + subtle bg tint.
- **Icons:** 20px, muted color (white when active).

### 2. Main Feed (Center)

- **Max Width:** 700px
- **Tabs (New):**
  - Style: "Pill" shape.
  - Active: Primary Background + White Text.
  - Inactive: Surface Background + Muted Text.
- **Post Card:**
  - Background: Surface color (#18181b).
  - Border: 1px solid Border color (#27272a).
  - Radius: `rounded-xl`.
  - Spacing: `p-6` internal padding.

### 3. Right Sidebar (Widgets)

- **Width:** 300px (Hidden on Tablet/Mobile)
- **Widgets:**
  - "My Status": XP Bar, Current Level.
  - "Leaderboard": Mini-list of top 5 users.

## 🧩 Components

### Topic Badges

Small inline badges on Post Cards to indicate category.

- **Youtube:** Red-500/10 bg.
- **MMO:** Green-500/10 bg.
- **Share:** Blue-500/10 bg.

### Filter Tabs

Horizontal scrollable container on mobile, grid on desktop.

```css
.tab-active {
  @apply bg-primary text-primary-foreground shadow-md transform scale-105 transition-all;
}
.tab-inactive {
  @apply bg-muted text-muted-foreground hover:bg-muted/80;
}
```

## ✨ Interactions

- **Hover:** All interactive cards lift slightly (`-translate-y-1`) and gain shadow.
- **Loading:** Skeleton with shimmering gradient.
- **Transitions:** All state changes have `duration-200 ease-in-out`.
