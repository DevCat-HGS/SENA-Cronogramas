# SENA Management System

## 📋 Descripción
Sistema integral de gestión para instructores SENA, que permite la administración de actividades, horarios y reportes.

## 🏗️ Arquitectura

El proyecto está dividido en dos partes principales:

### Frontend
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- Testing (Jest + Testing Library)
- PWA Support

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Jest para testing

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- MongoDB
- npm/yarn
- Git

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/your-username/sena-management.git
cd sena-management
```

2. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

3. Instalar dependencias del backend:
```bash
cd ../backend
npm install
```

4. Configurar variables de entorno:
```bash
# En /frontend
cp .env.example .env.local

# En /backend
cp .env.example .env
```

5. Iniciar los servidores:
```bash
# En /backend
npm run dev

# En /frontend
npm run dev
```

## 📁 Estructura del Proyecto

```
sena-management/
├── frontend/           # Aplicación Next.js
│   ├── src/           # Código fuente
│   ├── public/        # Archivos estáticos
│   └── docs/          # Documentación
├── backend/           # API Node.js
│   ├── src/          # Código fuente
│   ├── tests/        # Tests
│   └── docs/         # Documentación
└── docs/             # Documentación general
```

## 🔑 Características Principales

- 🔐 Autenticación JWT
- 📱 Diseño Responsive
- 🔄 Estado Global
- 📊 Dashboard en tiempo real
- 📝 Gestión de actividades
- 👥 Administración de instructores
- 📈 Reportes y análisis
- 🌐 PWA Support

## 📚 Documentación

- [Documentación Frontend](frontend/docs/README.md)
- [Documentación Backend](backend/docs/README.md)
- [Guía de Contribución](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## �� Testing

### Frontend
```bash
cd frontend
npm run test
```

### Backend
```bash
cd backend
npm run test
```

## 🚀 Despliegue

### Frontend
```bash
cd frontend
npm run deploy
```

### Backend
```bash
cd backend
npm run deploy
```

## 👥 Contribución

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/amazing-feature`)
3. Commit los cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Soporte

Si tienes alguna pregunta o sugerencia, por favor abre un issue en el repositorio.

## ✨ Agradecimientos

- Equipo de desarrollo SENA
- Contribuidores
- Comunidad Open Source
