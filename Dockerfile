# Sử dụng Node 22
FROM node:22

# Thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json trước để tối ưu cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Cài nodemon toàn cục (chỉ dùng trong dev)
RUN npm install -g nodemon

# Sao chép toàn bộ source code
COPY . .

# Mở cổng
EXPOSE 5000

# Chạy bằng nodemon
CMD ["npx", "nodemon", "server.js"]
