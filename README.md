# 🏗️ Builder Ecosystem Clone

**Một nền tảng cộng đồng và giáo dục hiện đại** được xây dựng với Next.js 16, Supabase và TailwindCSS.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Tech Stack](#️-tech-stack)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#️-cấu-hình)
- [Chạy Dự Án](#-chạy-dự-án)
- [Database Setup](#️-database-setup)
- [Deploy](#-deploy)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Đóng Góp](#-đóng-góp)

---

## 🎯 Giới Thiệu

**Builder Ecosystem Clone** là một nền tảng cộng đồng và giáo dục được thiết kế để:

- 🤝 Kết nối cộng đồng builders, developers và creators
- 📚 Chia sẻ kiến thức, bài viết và tài nguyên
- 🎮 Gamification với hệ thống XP, Levels và Badges
- 💬 Tương tác real-time với chat và notifications
- 🌐 Hỗ trợ đa ngôn ngữ (Tiếng Việt & English)

---

## ✨ Tính Năng

### 🔐 Authentication

- Đăng nhập với Google OAuth
- Email/Password authentication
- Magic Link (OTP)

### 📝 Community Feed

- Tạo, sửa, xóa bài viết
- Upload ảnh (Supabase Storage)
- Like và Comment real-time
- **Topic Filter**: Youtube, MMO, Share
- Post approval system (cho admin)

### 🎮 Gamification

- **XP System**: Kiếm điểm kinh nghiệm
- **5 Levels**: Newbie → Expert
- **Badges**: Early Adopter, Writer, Influencer
- **Leaderboards**: Xếp hạng top users

### 💬 Messaging

- Direct Messages 1-1
- Real-time chat với Supabase Realtime
- Unread message counter

### 🔔 Notifications

- Like, Comment, Follow notifications
- Real-time updates
- Mark as read

### 🛠️ Productivity Tools

- **Todos**: Task management
- **Journal**: Daily notes
- **Pomodoro Timer**: Focus timer

### 🎨 UI/UX

- **Deep Glass Theme**: Dark mode tối ưu
- Responsive design (Mobile + Desktop)
- Internationalization (i18n)
- Smooth animations

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn/UI (Radix UI)
- **Styling**: TailwindCSS
- **State Management**: React Context
- **Icons**: Lucide React

### Backend

- **Framework**: Next.js Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Deployment

- **Server**: VPS (Ubuntu 22.04)
- **Panel**: aaPanel
- **Web Server**: Nginx (Reverse Proxy)
- **Process Manager**: PM2
- **Node Version**: 20.x

---

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js >= 20.x
- npm >= 10.x
- Git

### Bước 1: Clone Repository

```bash
git clone https://github.com/your-username/builder-ecosystem.git
cd builder-ecosystem
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install --legacy-peer-deps
```

> **Lưu ý**: Dùng `--legacy-peer-deps` để tránh conflict với `react-day-picker`

---

## ⚙️ Cấu Hình

### Tạo File `.env.local`

Copy file example và điền thông tin Supabase:

```bash
cp .env.local.example .env.local
```

Nội dung file `.env.local`:

```env
# ====================================
# SUPABASE CONFIGURATION (Required)
# ====================================
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Lấy Supabase Credentials

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚀 Chạy Dự Án

### Development Mode

```bash
npm run dev
```

App sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## 🗄️ Database Setup

### Bước 1: Tạo Supabase Project

1. Truy cập [Supabase](https://supabase.com)
2. Tạo project mới
3. Đợi database khởi tạo (~2 phút)

### Bước 2: Chạy Migrations

Vào **SQL Editor** trên Supabase Dashboard và chạy các file SQL theo thứ tự:

#### 1. Core Setup

```sql
-- File: supabase/COMPLETE_SETUP.sql
-- Tạo tables: profiles, posts, likes, comments, badges, notifications, chat
```

#### 2. Additional Modules

```sql
-- File: supabase/xp_system.sql
-- Hệ thống XP và Levels

-- File: supabase/badges.sql
-- Hệ thống Badges

-- File: supabase/chat.sql
-- Direct messaging

-- File: supabase/follows.sql
-- Follow system

-- File: supabase/notifications.sql
-- Notification system
```

#### 3. Migrations

```sql
-- File: supabase/migrations/20260127_add_topic_to_posts.sql
-- Thêm topic filter (Youtube/MMO/Share)
```

### Bước 3: Verify Database

Kiểm tra các tables đã được tạo:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

Kết quả mong đợi:

- `profiles`
- `posts`
- `likes`
- `comments`
- `badges`
- `user_badges`
- `notifications`
- `conversations`
- `direct_messages`
- `follows`

---

## 🌐 Deploy

### Deploy lên VPS (Ubuntu)

Xem hướng dẫn chi tiết tại: [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)

**Tóm tắt:**

1. **Setup VPS**

   ```bash
   # Install Node.js 20.x
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone & Build**

   ```bash
   git clone <repo-url>
   cd builder-ecosystem
   npm install --legacy-peer-deps
   npm run build
   ```

3. **Start with PM2**

   ```bash
   pm2 start npm --name "builder-ecosystem" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx**

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL với Certbot**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 📁 Cấu Trúc Thư Mục

```
builder-ecosystem/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes
│   │   ├── (main)/            # Main app routes
│   │   ├── actions/           # Server Actions
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── feed/              # Feed components
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # Shadcn UI components
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── context/               # React Context
│   ├── config/                # Configuration files
│   ├── types/                 # TypeScript types
│   └── i18n/                  # Internationalization
├── supabase/                  # Database schemas
│   ├── COMPLETE_SETUP.sql
│   ├── migrations/
│   └── ...
├── docs/                      # Documentation
│   ├── DEPLOYMENT_GUIDE.md
│   ├── reports/               # Audit reports
│   └── ...
├── public/                    # Static files
├── .env.local.example         # Environment variables example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🤝 Đóng Góp

Contributions are welcome! Vui lòng:

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Credits

- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Backend**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)

---

## 📞 Liên Hệ

- **Website**: [tulanh.online](https://tulanh.online)
- **Email**: your-email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)

---

**Made with ❤️ by Builder Community**
