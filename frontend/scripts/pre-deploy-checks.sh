#!/bin/bash

echo "🔍 Ejecutando verificaciones pre-despliegue..."

# Verificar tipos
echo "Verificando tipos..."
npm run typecheck

# Ejecutar tests
echo "Ejecutando tests..."
npm run test

# Verificar linting
echo "Verificando linting..."
npm run lint

# Construir la aplicación
echo "Construyendo aplicación..."
npm run build

# Verificar bundle size
echo "Analizando tamaño del bundle..."
npm run build:analyze

# Verificar variables de entorno
if [ ! -f .env.production ]; then
    echo "❌ Error: Archivo .env.production no encontrado"
    exit 1
fi

echo "✅ Todas las verificaciones completadas" 