# 🚑 Deployment Troubleshooting Guide: Nginx & Zombie Processes

Last Updated: 2026-02-08

## 1. Vấn đề "Code mới build xong nhưng giao diện cũ"

**Triệu chứng:**

- Đã `git pull`, `npm run build`, `pm2 restart` thành công.
- `curl localhost:3000` vẫn ra nội dung cũ.
- `pm2 list` có thể hiện process đang chạy bình thường.

**Nguyên nhân gốc rễ:**

- **Zombie Process:** Process Node.js cũ không bị kill hoàn toàn bởi `pm2 delete/restart`, vẫn chiếm port 3000.
- `pm2` đôi khi chỉ kill process wrapper mà không kill được child process `next start` thực sự nếu có lỗi signal.

**Giải pháp (Force Kill & Restart):**

```bash
# 1. Kiểm tra process đang chiếm port
fuser 3000/tcp    # Hoặc: netstat -tulpn | grep 3000

# 2. Force Kill (Quan trọng)
fuser -k -9 3000/tcp

# Hoặc nếu fuser không có:
lsof -t -i:3000 | xargs -r kill -9

# 3. Khởi động lại PM2
pm2 delete all
pm2 start npm --name "tulanh" -- start
```

---

## 2. Vấn đề "Nginx config không cập nhật / Thiếu HTTPS"

**Triệu chứng:**

- Truy cập HTTP được nhưng HTTPS lỗi.
- Sửa file `/etc/nginx/sites-available/...` nhưng không có tác dụng.
- Nginx restart báo OK nhưng cấu hình không đổi.

**Nguyên nhân gốc rễ (aaPanel / Ubuntu specific):**

- **Sai file config:** aaPanel sử dụng đường dẫn config riêng tại `/www/server/panel/vhost/nginx/tulanh.online.conf`.
- File này **include** vào `nginx.conf` chính.
- File trong `/etc/nginx/sites-available/` có thể chỉ là bản copy cũ hoặc symlink sai.
- Nếu config thiếu block `server { listen 443 ssl ... }`, HTTPS sẽ không hoạt động.

**Giải pháp:**

1. **Luôn sửa file config của aaPanel:**

   ```bash
   nano /www/server/panel/vhost/nginx/tulanh.online.conf
   ```

2. **Cấu trúc chuẩn cho Next.js Reverse Proxy (HTTP + HTTPS):**

   ```nginx
   # HTTP -> HTTPS redirect (Optional)
   server {
       listen 80;
       server_name tulanh.online www.tulanh.online;
       # return 301 https://$host$request_uri;

       # Proxy pass cho HTTP
       location / {
           proxy_pass http://127.0.0.1:3000;
           # ... standard proxy headers ...
       }
   }

   # HTTPS Block (BẮT BUỘC)
   server {
       listen 443 ssl;
       server_name tulanh.online www.tulanh.online;

       # SSL Certs (Kiểm tra đường dẫn chính xác)
       ssl_certificate /etc/letsencrypt/live/tulanh.online/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/tulanh.online/privkey.pem;

       ssl_protocols TLSv1.2 TLSv1.3;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Reload Nginx:**
   ```bash
   nginx -t          # Kiểm tra cú pháp
   service nginx reload
   ```

## 3. Lỗi Build "RAM yếu" hoặc "Dependency Conflict"

**Triệu chứng:**

- `npm run build` bị kill hoặc treo.
- `npm install` lỗi `ERESOLVE`.

**Giải pháp:**

- **Thêm Swap RAM:**
  ```bash
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  ```
- **Install với Legacy Peer Deps:**
  ```bash
  npm install --legacy-peer-deps
  ```
