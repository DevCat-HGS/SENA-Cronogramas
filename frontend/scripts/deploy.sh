#!/bin/bash

echo "🚀 Starting deployment process..."

# Ejecutar verificaciones pre-despliegue
./scripts/pre-deploy-checks.sh

if [ $? -ne 0 ]; then
  echo "❌ Pre-deploy checks fallaron"
  exit 1
fi

# Build the application
echo "📦 Building application..."
NODE_ENV=production npm run build

# Run tests
echo "🧪 Running tests..."
npm run test

# Run type checking
echo "📝 Running type check..."
npm run typecheck

# Run linting
echo "🔍 Running linter..."
npm run lint

# Generate sitemap
echo "🗺️ Generating sitemap..."
npm run generate-sitemap

# Optimize images
echo "🖼️ Optimizing images..."
npm run optimize-images

echo "✅ Deployment preparation complete!" 