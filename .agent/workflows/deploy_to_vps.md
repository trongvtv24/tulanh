---
description: Hướng dẫn Deploy Website Next.js lên VPS (Ubuntu) sử dụng PM2 và Nginx
---

# 🚀 Hướng Dẫn Deploy Vietnam Social Lên VPS

Tài liệu này hướng dẫn chi tiết cách deploy dự án Next.js kết nối Supabase lên VPS chạy Ubuntu (20.04/22.04).

## 1. Chuẩn Bị

- **VPS**: Hệ điều hành Ubuntu 22.04 (khuyến nghị).
- **Domain**: Đã trỏ DNS về IP của VPS (ví dụ: `A @ 1.2.3.4`).
- **SSH Client**: Putty hoặc Terminal.

---

## 2. Cài Đặt Môi Trường Trên VPS

Đăng nhập vào VPS qua SSH và chạy các lệnh sau:

### Cập nhật hệ thống

```bash
sudo apt update && sudo apt upgrade -y
```

### Cài đặt Node.js (Phiên bản 20.x LTS)

```bash
# Cài đặt curl nếu chưa có
sudo apt install curl -y

# Tải script cài đặt Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Cài đặt Node.js
sudo apt install -y nodejs

# Kiểm tra version
node -v
# Output nên là v20.x.x
```

### Cài đặt Git, Nginx và Certbot (SSL)

```bash
sudo apt install git nginx certbot python3-certbot-nginx -y
```

### Cài đặt PM2 (Process Manager để chạy app nền)

```bash
sudo npm install -g pm2
```

---

## 3. Clone Mã Nguồn & Cài Đặt

### Clone code từ GitHub

```bash
# Di chuyển ra thư mục web server
cd /var/www

# Clone repo (Nhớ thay link repo của bạn)
sudo git clone https://github.com/vutrongvtv24-cloud/vietnam-social.git

# Đổi tên thư mục cho gọn (Option)
sudo mv vietnam-social mysite

# Cấp quyền cho user hiện tại (thay 'ubuntu' bằng username của bạn nếu khác)
sudo chown -R $USER:$USER /var/www/mysite

# Vào thư mục dự án
cd /var/www/mysite
```

### Cài đặt Dependencies và Build

```bash
# Cài package
npm install

# Tạo file môi trường
# Copy nội dung từ .env.local trên máy tính của bạn vào đây
nano .env.local
# (Paste nội dung vào, nhấn Ctrl+O -> Enter để lưu, Ctrl+X để thoát)

# Build dự án
npm run build
```

---

## 4. Chạy Ứng Dụng với PM2

```bash
# Khởi chạy Next.js với PM2
pm2 start npm --name "vietnam-social" -- start

# Lưu trạng thái để tự khởi động lại khi reboot VPS
pm2 save
pm2 startup
# (Copy và chạy dòng lệnh mà pm2 startup in ra màn hình)
```

Kiểm tra app đang chạy ở port 3000:

```bash
curl http://localhost:3000
```

---

## 5. Cấu Hình Nginx (Reverse Proxy)

Chúng ta cần Nginx để trỏ domain vào port 3000 của Next.js.

### Tạo file cấu hình

```bash
sudo nano /etc/nginx/sites-available/vietnam-social
```

### Dán nội dung sau vào file (thay `yourdomain.com` bằng domain thật):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

Lưu lại (Ctrl+O -> Enter -> Ctrl+X).

### Kích hoạt cấu hình

```bash
# Tạo shortcut sang thư mục sites-enabled
sudo ln -s /etc/nginx/sites-available/vietnam-social /etc/nginx/sites-enabled/

# Kiểm tra lỗi cú pháp
sudo nginx -t

# Khởi động lại Nginx
sudo systemctl restart nginx
```

---

## 6. Cài Đặt SSL (HTTPS) Tự Động

Sử dụng Certbot để cài SSL miễn phí từ Let's Encrypt:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- Nhập email để nhận thông báo.
- Chọn `Y` để đồng ý điều khoản.
- Chọn `2` (Redirect) nếu được hỏi để tự động chuyển HTTP sang HTTPS.

---

## 🎉 Hoàn Tất!

Bây giờ bạn có thể truy cập website tại `https://yourdomain.com`.

### Các lệnh bảo trì thường dùng:

- **Xem log lỗi:** `pm2 logs vietnam-social`
- **Cập nhật code mới:**
  ```bash
  cd /var/www/mysite
  git pull origin main
  npm install
  npm run build
  pm2 restart vietnam-social
  ```
