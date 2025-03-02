# CTPGA Management System

## Overview
The CTPGA Management System is a comprehensive web application designed to manage activities, instructors, events, and reports for the Technology Center. The system consists of three main components:
- Backend API (Node.js + Express + MongoDB)
- Admin Panel (React + TypeScript)
- Instructor Panel (React + TypeScript)

## System Architecture

### Backend
- **Technology Stack**: Node.js, Express, MongoDB
- **Key Features**:
  - RESTful API endpoints
  - JWT Authentication
  - Role-based access control
  - Data validation
  - Error handling
  - Rate limiting
  - Caching middleware
  - Logging system

### Admin Frontend
- **Technology Stack**: React, TypeScript, Vite
- **Key Features**:
  - Instructor management
  - Activity tracking
  - Event scheduling
  - Report generation
  - Request approval system

### Instructor Frontend
- **Technology Stack**: React, TypeScript, Vite
- **Key Features**:
  - Activity management
  - Schedule viewing
  - Report submission
  - Profile management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy .env.example to .env and configure your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run start
   ```

### Admin Frontend Setup
1. Navigate to the Admin Frontend directory:
   ```bash
   cd Frontend/Admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Instructor Frontend Setup
1. Navigate to the Instructor Frontend directory:
   ```bash
   cd Frontend/InstruPanel
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Main Endpoints

#### Authentication
- POST /api/admin/login - Admin login
- POST /api/instructors/login - Instructor login

#### Instructors
- GET /api/instructors - Get all instructors
- GET /api/instructors/:id - Get instructor by ID
- POST /api/instructors - Create new instructor
- PUT /api/instructors/:id - Update instructor
- DELETE /api/instructors/:id - Delete instructor

#### Activities
- GET /api/actividades - Get all activities
- POST /api/actividades - Create new activity
- PUT /api/actividades/:id - Update activity
- DELETE /api/actividades/:id - Delete activity

#### Events
- GET /api/eventos - Get all events
- POST /api/eventos - Create new event
- PUT /api/eventos/:id - Update event
- DELETE /api/eventos/:id - Delete event

## Development

### Code Structure
```
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── Frontend/
│   ├── Admin/
│   └── InstruPanel/
└── MongoDB/
```

### Testing
Run backend tests:
```bash
cd Backend
npm run test
```

## Security
- JWT token authentication
- Request rate limiting
- Input validation
- XSS protection
- CORS configuration

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License.

## Support
For support and questions, please open an issue in the repository.