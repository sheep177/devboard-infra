#!/bin/bash

echo "🔄 Stopping existing backend process..."
sudo pkill -f 'java -jar'

echo "📁 Changing to real Maven backend directory..."
cd ~/devboard-infra/devboard-backend

echo "🧱 Building backend JAR..."
./mvnw clean package -DskipTests

echo "🚀 Starting new backend process..."
nohup java -jar target/devboard-backend-0.0.1-SNAPSHOT.jar > ~/devboard-backend/backend.log 2>&1 &

echo "✅ Done. Check backend.log for startup info."
