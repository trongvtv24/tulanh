$VPS_IP = "43.228.214.174"
$USER = "root"
$CONFIG_PATH = "/www/server/panel/vhost/nginx/tulanh.online.conf"

Write-Host "========= BAT DAU CAU HINH VPS =========" -ForegroundColor Cyan
Write-Host "Dang ket noi den $VPS_IP... (Hay nhap mat khau neu duoc hoi)" -ForegroundColor Yellow

# 1. Upload base config
Write-Host "`n1. Uploading Nginx configuration..." -ForegroundColor Green
scp nginx_base.conf ${USER}@${VPS_IP}:${CONFIG_PATH}

if ($LASTEXITCODE -ne 0) {
    Write-Error "Upload failed!"
    exit
}

# 2. Run remote commands
Write-Host "`n2. SSH connect to install SSL and reload..." -ForegroundColor Green
ssh ${USER}@${VPS_IP} "
    export PATH=\$PATH:/www/server/nginx/sbin
    
    echo '[REMOTE] Kiem tra Nginx config...'
    nginx -t
    
    if [ \$? -eq 0 ]; then
        echo '[REMOTE] Config OK. Reloading Nginx...'
        service nginx reload || /etc/init.d/nginx reload
        
        echo '[REMOTE] Installing Certbot (neu chua co)...'
        if ! command -v certbot &> /dev/null; then
            apt update
            apt install certbot python3-certbot-nginx -y
        fi
        
        echo '[REMOTE] Generating SSL Certificates...'
        # Run certbot to obtain cert and modify nginx config automatically
        certbot --nginx -d tulanh.online -d www.tulanh.online --non-interactive --agree-tos -m admin@tulanh.online --redirect
        
        echo '[REMOTE] Reloading Nginx again...'
        service nginx reload || /etc/init.d/nginx reload
        
        echo 'SUCCESS! Website hien da chay HTTPS.'
    else
        echo '[ERROR] Nginx config check failed!'
        exit 1
    fi
"

Write-Host "`n========= HOAN TAT =========" -ForegroundColor Cyan
