#!/bin/bash

echo "🚀 Start unified deploy script..."

# === 同步最新代码 ===
echo "🌀 Pulling latest code from GitHub..."
cd ~/devboard-infra
git fetch --all
git reset --hard origin/main
git clean -fd

# === 后端部分 ===
echo "🔪 Killing any process using port 8080..."
fuser -k 8080/tcp || true

echo "📦 Building backend..."
cd ~/devboard-infra/devboard-backend
./mvnw clean package -DskipTests

echo "🚀 Starting backend with nohup..."
nohup java -jar target/devboard-backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &

# === 前端部分 ===
FRONTEND_DIST=~/devboard-infra/devboard-frontend-dist
NGINX_DIR=/var/www/devboard-frontend

echo "🧹 Cleaning old frontend files in $NGINX_DIR..."
sudo rm -rf $NGINX_DIR/*
echo "📤 Copying new frontend files from $FRONTEND_DIST..."
sudo cp -r $FRONTEND_DIST/* $NGINX_DIR/

echo "✅ Deployment completed."
