# Movie Booking Application - Technical Specification

## 1. Project Overview

**Project Name:** MovieBookingApp
**Project Type:** Full-stack Web Application (Frontend + Backend + Database)
**Core Functionality:** A complete movie booking system where users can browse movies, select show timings, choose seats, and complete bookings.
**Target Users:** General public seeking to book movie tickets online

## 2. Architecture

### System Architecture
```
Frontend (React) → REST API (Express) → Database (Aiven PostgreSQL)
```

### Tech Stack
- **Frontend:** React 18, Tailwind CSS, Axios, React Router v6
- **Backend:** Node.js, Express.js, JWT, bcrypt, cookie-parser
- **Database:** PostgreSQL (Aiven Cloud)

## 3. Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| role | ENUM('user', 'admin') | DEFAULT 'user' |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Movies Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| poster_url | VARCHAR(500) | |
| duration | INT | (minutes) |
| genre | VARCHAR(50) | |
| language | VARCHAR(50) | |
| release_date | DATE | |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Theaters Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| location | VARCHAR(255) | |
| total_seats | INT | DEFAULT 100 |

### Shows Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| movie_id | INT | FOREIGN KEY |
| theater_id | INT | FOREIGN KEY |
| show_time | TIME | |
| show_date | DATE | |
| price | DECIMAL(10,2) | |
| available_seats | INT | |

### Seats Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| show_id | INT | FOREIGN KEY |
| seat_number | VARCHAR(10) | |
| row | CHAR(1) | |
| column | INT | |
| status | ENUM('available', 'booked', 'locked') | DEFAULT 'available' |
| price | DECIMAL(10,2) | |

### Bookings Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INT | FOREIGN KEY |
| show_id | INT | FOREIGN KEY |
| seat_ids | INT[] | |
| total_amount | DECIMAL(10,2) | |
| status | ENUM('confirmed', 'cancelled', 'pending') | |
| payment_id | VARCHAR(255) | |
| created_at | TIMESTAMP | DEFAULT NOW() |

## 4. API Endpoints

### Authentication APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/signup | Register new user | No |
| POST | /api/auth/login | User login | No |
| POST | /api/auth/logout | User logout | Yes |
| GET | /api/auth/me | Get current user | Yes |

### Movie APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/movies | Get all movies | No |
| GET | /api/movies/:id | Get movie details | No |
| POST | /api/movies | Create movie | Admin |
| PUT | /api/movies/:id | Update movie | Admin |
| DELETE | /api/movies/:id | Delete movie | Admin |

### Theater APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/theaters | Get all theaters | No |
| GET | /api/theaters/:id | Get theater details | No |

### Show APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/shows/:movieId | Get shows by movie | No |
| POST | /api/shows | Create show | Admin |

### Seat APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/seats/:showId | Get seats for show | Yes |

### Booking APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/bookings | Create booking | Yes |
| GET | /api/bookings/user | Get user bookings | Yes |

### Payment APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/payments/create | Create payment | Yes |
| POST | /api/payments/verify | Verify payment | Yes |

## 5. Frontend Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| / | HomePage | List all movies |
| /signup | SignupPage | User registration |
| /login | LoginPage | User login |
| /movies/:id | MovieDetailsPage | Movie details |
| /shows/:movieId | ShowsPage | Show timings |
| /seats/:showId | SeatsPage | Seat selection |
| /checkout | CheckoutPage | Payment confirmation |
| /my-bookings | MyBookingsPage | Booking history |

## 6. Security Requirements

- JWT stored in HTTP-only cookies only (NO localStorage)
- Password hashing with bcrypt (10 rounds)
- JWT expiration: 7 days
- CORS configuration for frontend origin
- Input validation on all endpoints
- Role-based access control (admin vs user)

## 7. Acceptance Criteria

1. User can register and login with JWT authentication
2. User can browse all movies on home page
3. User can view movie details
4. User can select show timing for a movie
5. User can view and select available seats
6. User can complete payment and confirm booking
7. User can view their booking history
8. JWT stored securely in HTTP-only cookies
9. Protected routes redirect to login if not authenticated
10. Admin can manage movies and shows
