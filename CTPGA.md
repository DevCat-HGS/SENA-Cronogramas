# CTPGA-Manager

Una aplicación web robusta para la gestión de cronogramas académicos, diseñada específicamente para instructores del SENA.

## 🚀 Descripción

CTPGA-Manager (Cronograma de Trabajo Personal y Gestión Académica) es una plataforma web que permite a los instructores:
- Gestionar sus actividades formativas
- Organizar eventos académicos
- Generar reportes mensuales de actividades
- Administrar cronogramas de manera eficiente
- Realizar seguimiento de horas laborales

## ✨ Características Principales

### Gestión de Instructores
- Registro y administración de perfiles de instructores
- Sistema de autenticación seguro mediante correo y documento de identidad
- Gestión de información personal y profesional

### Gestión de Actividades
- Creación y edición de actividades formativas
- Asignación de múltiples instructores a actividades
- Control de fechas y horarios
- Seguimiento de competencias y resultados de aprendizaje

### Gestión de Eventos
- Programación de eventos académicos
- Asignación de participantes
- Control de fechas de entrega

### Sistema de Reportes
- Generación de reportes mensuales
- Exportación de datos en formato CSV
- Seguimiento de horas trabajadas
- Filtrado por instructor y período

## 🛠 Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- ESLint

### Backend
- Node.js
- Express
- MySQL2
- CORS
- JWT para autenticación
- JavaScript

### Base de Datos
- MySQL

### Herramientas de Desarrollo
- Git
- GitHub
- PostCSS

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- MySQL (versión 5.7 o superior)
- npm o yarn
- Git

## 🔧 Instalación

1. Clona el repositorio:
   bash
   git clone https://github.com/DevCat-HGS/SENA-Cronogramas.git
   

2. Configura la base de datos:
   bash
   # Crea una base de datos llamada 'sena_management'
   # Importa el esquema desde el archivo SQL proporcionado
   

3. Configura las variables de entorno:
   bash
   # Crea un archivo .env en la raíz del proyecto
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=sena_management
   JWT_SECRET=tu_clave_secreta
   

4. Instala las dependencias:
   bash
   cd SENA-Cronogramas
   npm install
   

5. Inicia el servidor:
   bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   

## 🚀 Estructura del Proyecto


SENA-Cronogramas/
├── src/
│   ├── components/
│   ├── services/
│   ├── pages/
│   └── utils/
├── server/
│   ├── routes/
│   ├── controllers/
│   └── models/
└── public/


## 📦 API Endpoints

### Instructores
- GET /api/instructors - Obtener todos los instructores
- POST /api/instructors - Crear nuevo instructor
- PUT /api/instructors/:id - Actualizar instructor
- DELETE /api/instructors/:id - Eliminar instructor

### Actividades
- GET /api/activities - Obtener todas las actividades
- POST /api/activities - Crear nueva actividad
- PUT /api/activities/:id - Actualizar actividad
- DELETE /api/activities/:id - Eliminar actividad

### Eventos
- GET /api/events - Obtener todos los eventos
- POST /api/events - Crear nuevo evento
- PUT /api/events/:id - Actualizar evento
- DELETE /api/events/:id - Eliminar evento

### Reportes
- GET /api/reports - Obtener todos los reportes
- POST /api/reports - Crear nuevo reporte
- GET /api/reports/generate-csv - Generar reporte CSV

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu característica (git checkout -b feature/AmazingFeature)
3. Haz commit de tus cambios (git commit -m 'Add some AmazingFeature')
4. Haz push a la rama (git push origin feature/AmazingFeature)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles

## 📧 Contacto

DevCat-HGS - [GitHub Profile](https://github.com/DevCat-HGS)

Link del proyecto: [https://github.com/DevCat-HGS/SENA-Cronogramas](https://github.com/DevCat-HGS/SENA-Cronogramas) 
