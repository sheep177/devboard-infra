#!/bin/bash

echo "🚀 Start unified deploy script..."

# === 后端部分 ===
echo "🔄 Stopping existing backend process (if any)..."
pkill -f 'devboard-backend-0.0.1-SNAPSHOT.jar'

echo "🚚 Moving backend jar to run directory..."
cd ~/devboard-infra/devboard-backend
mv target/devboard-backend-0.0.1-SNAPSHOT.jar app.jar

echo "🚀 Starting backend with nohup..."
nohup java -jar app.jar > backend.log 2>&1 &

# === 前端部分 ===
FRONTEND_DIST=~/devboard-infra/devboard-frontend-dist
NGINX_DIR=/var/www/devboard-frontend

echo "🧹 Cleaning old frontend files in $NGINX_DIR..."
sudo rm -rf $NGINX_DIR/*
echo "📦 Copying new frontend files from $FRONTEND_DIST..."
sudo cp -r $FRONTEND_DIST/* $NGINX_DIR/

echo "✅ Deploy script completed."

#!/bin/bash

echo "🔄 Killing any process using port 8080..."
fuser -k 8080/tcp || true

echo "🚀 Starting new backend JAR..."
cd /home/ubuntu/devboard-infra/devboard-backend

nohup java -jar target/devboard-backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &

echo "✅ Backend deployment complete."

