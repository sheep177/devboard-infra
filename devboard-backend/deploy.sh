#!/bin/bash

echo "🔄 Stopping existing backend process..."
sudo pkill -f 'devboard-backend' || true

echo "📁 Entering backend directory..."
cd ~/devboard-backend || { echo "❌ Failed to cd into ~/devboard-backend"; exit 1; }

echo "🧱 Building backend..."
./mvnw clean package -DskipTests

JAR_FILE=$(ls target/devboard-backend-*.jar | head -n 1)

if [[ ! -f "$JAR_FILE" ]]; then
  echo "❌ Build failed: JAR file not found in target/"
  exit 1
fi

echo "🚀 Starting backend: $JAR_FILE"
nohup java -jar "$JAR_FILE" > backend.log 2>&1 &

echo "✅ Backend deployed at $(date)"
