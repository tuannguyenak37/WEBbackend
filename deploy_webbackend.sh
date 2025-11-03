#!/bin/bash
apt-get update -y

# 1. Cài đặt các công cụ: git, docker, docker-compose, và mysql-client
apt-get install -y git docker.io docker-compose mysql-client

# Khởi động và cho phép Docker chạy
systemctl start docker
systemctl enable docker

# 2. Tải mã nguồn
cd /home/ubuntu
git clone https://github.com/tuannguyenak37/WEBbackend.git WEBbackend

# 3. Kết nối và khởi tạo CSDL
# THAY THẾ 'YOUR_RDS_PASSWORD_HERE' bằng mật khẩu CSDL thật của bạn
export MYSQL_PASSWORD="YOUR_RDS_PASSWORD_HERE"

# Tạo một chuỗi lệnh SQL
# Lệnh 'CREATE DATABASE IF NOT EXISTS' đảm bảo nó không báo lỗi khi máy chủ thứ 2 chạy
SQL_COMMANDS="CREATE DATABASE IF NOT EXISTS webshop2; USE webshop2; SOURCE /home/ubuntu/WEBbackend/webshop2.sql;"

# Thực thi chuỗi lệnh (Bao gồm cả 'USE webshop2' bạn đã chỉ ra)
mysql -h database-1.czekeimo0evc.ap-southeast-1.rds.amazonaws.com -u admin -p$MYSQL_PASSWORD -e "$SQL_COMMANDS"

# 4. Trở về thư mục và chạy Docker Compose
cd /home/ubuntu/WEBbackend

# Cấu hình tệp .env cho Docker (nếu cần)
# Tệp .env này phải được docker-compose.yml của bạn đọc
echo "DB_HOST=database-1.czekeimo0evc.ap-southeast-1.rds.amazonaws.com" > .env
echo "DB_USER=admin" >> .env
echo "DB_PASSWORD=$MYSQL_PASSWORD" >> .env
echo "DB_DATABASE=webshop2" >> .env

# Khởi chạy ứng dụng
docker compose up -d