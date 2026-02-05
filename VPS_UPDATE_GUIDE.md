# 🚀 Hướng dẫn cập nhật VPS (Fix lỗi Loading Treo)

Code mới đã được push lên GitHub. Anh hãy SSH vào VPS và thực hiện các bước sau:

## 1️⃣ Cập nhật Code mới

Di chuyển vào thư mục dự án và pull code:

```bash
cd /path/to/your/project/tulanh  # Đường dẫn tới thư mục dự án trên VPS
git pull origin main
```

## 2️⃣ Cập nhật biến môi trường (QUAN TRỌNG)

Lỗi "treo loading" chủ yếu do thiếu cấu hình Supabase làm app bị crash ngầm. Anh cần đảm bảo file `.env` hoặc `.env.local` trên VPS có đủ 2 dòng này:

```bash
nano .env.local
```

Dán nội dung sau vào (đây là key em vừa lấy được từ Supabase của anh):

```env
NEXT_PUBLIC_SUPABASE_URL=https://uoqyotwurkyjdrawqbpe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcXlvdHd1cmt5amRyYXdxYnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjUzOTksImV4cCI6MjA4NDM0MTM5OX0.brBwR5Xb4GclhbieaSS3dC9G6D3MnWWQQtCU9WWtYPk
```

Lưu lại (Ctrl+O, Enter) và thoát (Ctrl+X).

## 3️⃣ Rebuild và Khởi động lại

Nếu anh dùng **PM2** (chạy trực tiếp):

```bash
npm install           # Cài đặt thêm package nếu có (dự phòng)
npm run build        # Build lại ứng dụng Next.js
pm2 restart all      # Hoặc tên process cụ thể, ví dụ: pm2 restart tulanh
```

Nếu anh dùng **Docker**:

```bash
docker-compose down
docker-compose up -d --build
```
