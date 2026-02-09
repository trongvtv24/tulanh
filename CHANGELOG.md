# Changelog

## [2026-02-08] - Production Release

### Added

- **Infrastructure Code**: `configure_vps.ps1` và `nginx_base.conf` để tự động hóa cấu hình VPS bỏ qua Panel
- **HTTPS/SSL Config**: Auto SSL (Let's Encrypt) qua script

### Changed

- **Deployment URL**: Chính thức hoạt động tại `https://tulanh.online`
- **Nginx Strategy**: Chuyển từ config thủ công sang config-as-code để tránh conflict với aaPanel

### Fixed

- **Zombie Processes**: Xử lý triệt để process Node.js cũ bị treo bằng lệnh `fuser -k`
- **Mixed Content**: Fix lỗi HTTP/HTTPS bằng cách Force SSL

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
