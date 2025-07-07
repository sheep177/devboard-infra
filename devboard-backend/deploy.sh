#!/bin/bash

echo "🔄 Stopping existing backend process..."
sudo pkill -f 'devboard-backend' || true

echo "📁 Entering project root directory..."
cd ~/devboard-infra/devboard-backend || { echo "❌ Failed to cd"; exit 1; }

echo "🧱 Building backend..."
./mvnw clean package -DskipTests

JAR_FILE=$(ls target/devboard-backend-*.jar | head -n 1)

if [[ ! -f "$JAR_FILE" ]]; then
  echo "❌ Build failed: JAR not found."
  exit 1
fi

echo "🚀 Starting backend..."
nohup java -jar "$JAR_FILE" > ~/devboard-backend/backend.log 2>&1 &

echo "✅ Backend started with $JAR_FILE"
