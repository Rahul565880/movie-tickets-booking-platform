# Movie Booking Application

A full-stack movie booking application with React frontend, Express backend, and Aiven PostgreSQL database.

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** PostgreSQL (Aiven Cloud)

## Project Structure

```
movies-application/
├── backend/           # Express.js REST API
│   ├── config/        # Database config & initialization
│   ├── middleware/    # Auth middleware
│   ├── routes/       # API routes
│   ├── server.js     # Main server file
│   └── .env          # Environment variables
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── ...
├── SPEC.md           # Technical specification
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL (Aiven cloud or local)

### 1. Database Setup (Aiven)

1. Create a free account at https://console.aiven.io
2. Create a new PostgreSQL service
3. Get the connection details:
   - Host URL
   - Port
   - Database name
   - Username
   - Password

### 2. Backend Setup

```bash
cd backend

# Update .env with your Aiven credentials
# Then install dependencies and start

npm install
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Features

- User registration and login (JWT + HTTP-only cookies)
- Browse movies with Netflix-style UI
- View movie details and show timings
- Select seats from interactive seat layout
- Mock payment integration
- View booking history

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user

### Movies
- GET `/api/movies` - Get all movies
- GET `/api/movies/:id` - Get movie details

### Shows
- GET `/api/shows/:movieId` - Get shows by movie

### Seats
- GET `/api/seats/:showId` - Get seats for show

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/user` - Get user bookings

### Payments
- POST `/api/payments/create` - Create payment
- POST `/api/payments/verify` - Verify payment

## Security

- JWT stored in HTTP-only cookies (no localStorage)
- Password hashing with bcrypt
- CORS configured for frontend origin
- Protected routes on backend
