# System Architecture Overview

## Project: Builder Ecosystem Clone

The All In Plan Clone - A comprehensive community and education platform.

## Architecture Levels

### 1. Frontend (Next.js 16)

- **App Router:** Fully utilized for layout and routing.
- **UI:** Shadcn/UI + TailwindCSS.
- **State Management:** React Server Components (RSC) + Local State.

### 2. Backend (Supabase)

- **Database:** PostgreSQL.
- **Auth:** Supabase Auth (Email/Password, Social).
- **Storage:** Supabase Storage (Avatars, Badge Images).
- **Realtime:** Supabase Realtime (Chat, Notifications).

## Data Flow

Client (Shadcn UI) -> Server Actions / API Routes -> Supabase Client -> PostgreSQL (RLS Protected).

## Core Modules

1.  **Gamification:** XP, Levels, Badges.
2.  **Social:** Feeds, Follows, Comments.
3.  **Education:** Courses, Lessons (Upcoming).
4.  **Tools:** Todos, Journal, Pomodoro.
