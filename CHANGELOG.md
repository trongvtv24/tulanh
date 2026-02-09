# Changelog

## [2026-02-09] - Social Sharing & Post Details
 
 ### Added
 - **Single Post Page**: Route `/post/[id]` với Server-Side Rendering (SSR) để tối ưu SEO và metadata khi chia sẻ.
 - **Facebook Share**: Nút chia sẻ tích hợp, tự động copy link vào clipboard và mở dialog chia sẻ.
 - **Toast Notification**: Thông báo "Đã copy link" khi chia sẻ.
 
 ### Changed
 - **Post Timestamps**: Thời gian đăng bài giờ là liên kết dẫn trực tiếp đến trang chi tiết bài viết.
 - **PostActions**: Cập nhật logic xử lý sự kiện click để tránh xung đột (preventDefault/stopPropagation).
 
 ### Fixed
 - **Share Button**: Sửa lỗi nút share không hoạt động trên một số trình duyệt/VPS do popup blocker hoặc event bubbling.
 - **Metadata**: Cập nhật OpenGraph tags cho trang chi tiết bài viết.
 
 ---
 
 ## [2026-02-06] - Branding & Localization Update

### Added
- **Logo mới "The FRIDGE"**: Text với viền cam sáng (#f97316) và icon tủ lạnh
- **Favicon custom**: Sử dụng hình ảnh tủ lạnh thay vì favicon mặc định
- **Public Community Access**: Cho phép người dùng chưa đăng nhập xem bài viết đã duyệt
- **RLS Migration**: `20260206_make_community_posts_public.sql` - Cập nhật policy cho public access

### Changed
- **Trang chủ**: Hiển thị Community Feed ngay lập tức thay vì Landing Page
- **Ngôn ngữ**: Loại bỏ hoàn toàn tiếng Anh, chỉ giữ lại 100% Tiếng Việt
- **LanguageContext**: Đơn giản hóa, cố định ngôn ngữ Tiếng Việt
- **Header**: Xóa Language Selector, cập nhật logo mới

### Removed
- Language Selector component
- English language support
- LandingPage component khỏi homepage flow
- `favicon.ico` (thay bằng `icon.png`)

### Fixed
- VPS cache issue khi update assets (giải pháp: xóa `.next` folder trước khi build)
- Local build error do thiếu `.env.local`

### Technical Details
- **Logo Effects**: 
  - Text stroke: `1px #f97316` (orange)
  - Glow: `drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]` (blue)
  - Icon: `/images/fridge-logo.png` (đặt sau text)
- **Deployment**: Automated SSH deployment với cache clearing strategy

---

## [2026-02-05] - Stability & Deployment

### Added
- Automated deployment script via SSH
- Timeout mechanism cho Supabase hooks
- Error handling cho loading states

### Changed
- Deploy to VPS (43.228.214.174) using PM2

### Fixed
- Loading spinner stuck on empty Journal & Feed
- Infinite loading state khi Supabase chậm

---

## [2026-01-30] - Initial Release

### Added
- Gamification system (XP, Ranks, Badges)
- Community features (Posts, Likes, Comments)
- Note-taking với Markdown
- Productivity tools (Todos, Journal, Pomodoro)
- Supabase Auth + Google OAuth
