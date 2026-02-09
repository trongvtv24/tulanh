# 🚀 Hướng dẫn cập nhật VPS (Fix lỗi Loading Treo & Cache)

## ⚠️ Lưu ý Quan trọng về Nginx (aaPanel)
Trên VPS này, file cấu hình Nginx thực sự nằm ở:
`/www/server/panel/vhost/nginx/tulanh.online.conf`

**KHÔNG** sửa trong `/etc/nginx/sites-available/` vì sẽ không có tác dụng.

---

## 1️⃣ Force Kill & Update Code (Chống Zombie Process)
Để đảm bảo code cũ không bị "treo" (zombie), hãy chạy lệnh force kill trước khi restart:

```bash
cd /www/wwwroot/tulanh.online
git pull origin main

# Force kill process cũ trên port 3000
fuser -k -9 3000/tcp || true

# Cài đặt & Build (nếu có thay đổi package)
npm install --legacy-peer-deps
npm run build

# Khởi động lại PM2
pm2 delete all || true
pm2 start npm --name "tulanh" -- start
pm2 save
```

## 2️⃣ Cập nhật biến môi trường (Nếu cần)
File `.env.local` nằm tại `/www/wwwroot/tulanh.online/.env.local`.

---

## 3️⃣ Kiểm tra Nginx (Nếu mất HTTPS)
Nếu truy cập bị lỗi SSL/HTTPS, kiểm tra file config:

```bash
nano /www/server/panel/vhost/nginx/tulanh.online.conf
```

Đảm bảo có đủ block `server { listen 443 ssl ... }`. Sau đó reload:

```bash
nginx -t
service nginx reload
```

## 4️⃣ Kiểm tra nhanh
Sử dụng script verify tự tạo:
```bash
curl -s http://127.0.0.1:3000 | grep "The FRIDGE"
```
Nếu hiện output có chữ "The FRIDGE" là code mới đã chạy thành công.
