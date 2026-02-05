# Changelog

All notable changes to the **Tủ Lạnh (Tulanh Online)** project will be documented in this file.

## [2.1.0] - 2026-02-05 (Fixes & VPS Deploy)

### 🚀 Deployed
- **VPS Deployment**: Deployed production build to `43.228.214.174` using PM2.
- **Environment**: Configured `.env.local` on production server.

### 🐛 Fixed
- **Critical**: Fixed "Frozen Loading Icon" issue where the interface would hang due to missing Supabase credentials.
- **UI**: Fixed loading spinner persisting on "My Journal" and "Feed" when no entries/posts exist.
- **Stability**: Added timeouts (8s-10s) and error handling to `useSupabaseAuth`, `useFollow`, and `usePosts` hooks to prevent infinite loading loops.
- **Logic**: Corrected `hasMore` logic in infinite scroll to properly handle empty initial states.

### 🔧 Refactor
- Improved error handling in `useSupabaseAuth` initialization.

---

## [2.0.0] - 2026-02-05 (Audit & Optimizations)

### 🔄 Changed
- Refactored `GamificationContext` to fix hoisting errors.
- Split `Class` page components (AdminDashboard, ContentLocked) for better maintainability.
- Updated dependencies: `@supabase/supabase-js`, `react`, `next`.

### 🛡️ Security
- Completed full security audit (Score: 9/10).
- Confirmed RLS policies on all sensitive tables.

---

## [1.0.0] - 2026-01-30 (Initial Release)
- Initial release of Tủ Lạnh Online.
- Features: Community, Classes, Notes, Productivity Tools.
