#!/bin/bash

echo "🔄 Stopping existing backend process..."
sudo pkill -f 'java -jar'

echo "🚀 Starting new backend process..."
cd ~/devboard-backend
./mvnw clean package -DskipTests

# 运行 jar 包（请替换为你的实际 jar 路径）
nohup java -jar target/*.jar > backend.log 2>&1 &
