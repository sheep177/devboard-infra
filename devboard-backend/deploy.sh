#!/bin/bash

echo "🔄 Stopping existing backend process..."
sudo pkill -f 'java -jar'

echo "🚀 Starting new backend process..."
cd ~/devboard-backend
nohup java -jar target/devboard-backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &

echo "✅ Done. Check backend.log for startup info."
