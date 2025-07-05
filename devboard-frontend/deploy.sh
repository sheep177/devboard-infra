#!/bin/bash

echo "📦 Building frontend..."
npm install
npm run build

echo "🚀 Deploying to Nginx directory..."
rm -rf ~/devboard-frontend-dist/*
cp -r dist/* ~/devboard-frontend-dist/

