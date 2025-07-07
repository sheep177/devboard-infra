#!/bin/bash

echo "🚀 Starting unified deploy script..."

# === 后端部分 ===

echo "🔄 Killing old backend process using port 8080 (if any)..."
fuser -k 8080/tcp || true

echo "📍 Navigating to backend directory..."
cd /home/ubuntu/devboard-infra/devboard-backend

echo "🚀 Starting backend JAR with nohup..."
nohup java -jar target/devboard-backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &

echo "✅ Backend started."

# === 前端部分 ===

FRONTEND_DIST=/home/ubuntu/devboard-infra/devboard-frontend-dist
NGINX_DIR=/var/www/devboard-frontend

echo "🧹 Cleaning old frontend files from $NGINX_DIR..."
sudo rm -rf $NGINX_DIR/*

echo "📦 Copying new frontend files from $FRONTEND_DIST to $NGINX_DIR..."
sudo cp -r $FRONTEND_DIST/* $NGINX_DIR/

echo "✅ Frontend deployed."

echo "🎉 Deployment script finished successfully."
