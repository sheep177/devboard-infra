#!/bin/bash

set -e  # 遇到错误立即退出
echo "🚀 Start unified deploy script..."

# === 同步最新代码 ===
echo "🌀 Pulling latest code from GitHub..."
cd ~/devboard-infra
git fetch --all
git reset --hard origin/main
git clean -fd

# === 后端部分3 ===
echo "🔪 Killing any process using port 8080..."
fuser -k 8080/tcp || true

echo "📦 Building backend..."
cd ~/devboard-infra/devboard-backend
./mvnw clean package -DskipTests

echo "🚀 Starting backend with nohup..."
nohup java -jar target/devboard-backend-0.0.1-SNAPSHOT.jar > ~/devboard-infra/devboard-backend/backend.log 2>&1 &

# === 前端部分 ===
echo "🧱 Building frontend..."
cd ~/devboard-infra/devboard-frontend
rm -rf dist
npm install
npm run build

FRONTEND_DIST=~/devboard-infra/devboard-frontend/dist
NGINX_DIR=/var/www/devboard-frontend

echo "🧹 Cleaning old frontend files in $NGINX_DIR..."
sudo rm -rf $NGINX_DIR/*
echo "📤 Copying new frontend files from $FRONTEND_DIST..."
sudo cp -r $FRONTEND_DIST/* $NGINX_DIR/

echo "🧰 Fixing permissions..."
sudo chown -R www-data:www-data $NGINX_DIR
sudo chmod -R 755 $NGINX_DIR

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully."
