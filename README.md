# ROYAL TRAVEL - Backend

[Render](https://web-full-itmo-course.onrender.com) | [NestJS](https://nestjs.com/) | [Prisma](https://prisma.io/) | [PostgreSQL](https://www.postgresql.org/)

Backend for ROYAL TRAVEL - A tourism platform offering tours across Russia. Built with NestJS, Prisma ORM, PostgreSQL, and deployed on Render.

---

## Description

ROYAL TRAVEL is an online tour booking platform offering tours across Russia. This backend service handles all business logic, database operations, and serves dynamic web pages using the MVC pattern. The project is built with NestJS - a progressive Node.js framework, uses Prisma ORM for database interaction with PostgreSQL (Render PostgreSQL), and is deployed on Render.

---

## Author

| Information | Details |
|-------------|---------|
| Name | Nguyen Thi Thuy Duong |
| Email | nguyenduongitmo@gmail.com |
| GitHub | nguyenduongitmo |
| University | ITMO University, Russia |

---

## Live Demo

https://web-full-itmo-course.onrender.com

---

## Technologies

### Backend
- NestJS - Progressive Node.js framework
- Prisma ORM - Database access and management
- PostgreSQL - Relational database (Render PostgreSQL)
- EJS - Template engine

### API & Documentation
- **Swagger/OpenAPI** - RESTful API documentation
- **class-validator** - Data validation
- **class-transformer** - Data transformation

### Frontend (from previous semester)
- HTML5 - Semantic markup
- CSS3 - Custom styling with Flexbox and Grid
- JavaScript - Client-side interactivity
- Swiper.js - Banner slider

### DevOps
- Render - Cloud hosting and deployment (Web Service + PostgreSQL)
- GitHub - Version control and CI/CD

---

## Database Schema (Lab 2)

### Database Setup
- Provider: PostgreSQL on Render (Free Tier)
- ORM: Prisma 5.22.0
- Connection: Internal URL with SSL

### Entities (5 domain models)

| Entity | Description | Key Fields |
|--------|-------------|------------|
| **User** | System users | id, email, fullName, role |
| **Tour** | Travel packages | id, name, image, description, code, price, duration, isFeatured |
| **Feedback** | Customer reviews | id, fullName, email, rating, comment, tourId, userId |
| **Booking** | Tour reservations | id, bookingCode, userId, tourId, travelDate, passengers, status |
| **Contact** | Customer inquiries | id, fullName, email, phone, message, subscribe |

### Relationships

- User (1) -> Feedback (n) : One user can have many feedbacks
- User (1) -> Booking (n) : One user can book many tours
- Tour (1) -> Feedback (n) : One tour can receive many feedbacks
- Tour (1) -> Booking (n) : One tour can be booked many times

### ER Diagram

![ER Diagram](./erd.jpg)

---
## Features (Lab 3)

### 1. MVC Architecture with DDD

The application follows Domain-Driven Design principles with clear separation of concerns:

src/
- tours/ # Tour module (CRUD + SSE)
- bookings/ # Booking module (CRUD + SSE)
- feedbacks/ # Feedback module (CRUD + SSE)
- contacts/ # Contact module (CRUD + SSE)
- sse/ # Centralized SSE infrastructure
- prisma/ # Database service
    views/ # EJS templates
- pages/ # Page templates
    partials/ # Reusable components

### 2. Full CRUD Operations

All modules support complete CRUD operations: Tours, Bookings, Feedbacks, Contacts

### 3. Server-Sent Events (SSE) - Real-time Notifications

**Server-side:**
- Centralized `SseService` for event management
- Single SSE endpoint: `/api/events`
- Real-time events for Create, Update, Delete operations
- Event types: `create`, `update`, `delete`
- Event modules: `tours`, `bookings`, `feedbacks`, `contacts`

**Client-side:**
- `EventSource` API integration
- Auto-reconnection on connection loss
- Toast notifications with smooth animations

**SSE Flow:**
User Action -> Controller -> SseService.emit() -> /api/events -> Client -> Toast Notification

---

## Lab 4: RESTful API + Swagger (Completed)

### 1. RESTful API Architecture

- **Separate API Controllers** with `/api` prefix, independent from MVC
- **Global Exception Filter** for consistent error responses
- **Validation** with `class-validator` decorators
- **Pagination** with `page` & `limit` query params
- **HATEOAS** with `Link` header for navigation

### 2. Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Tours** |
| GET | `/api/tours` | List tours (paginated) |
| GET | `/api/tours/:id` | Get tour by ID |
| POST | `/api/tours` | Create tour |
| PATCH | `/api/tours/:id` | Update tour |
| DELETE | `/api/tours/:id` | Delete tour |
| **Bookings / Feedbacks / Contacts** | Same CRUD pattern |

### 3. Pagination Example
GET /api/tours?page=2&limit=5


**Response:**
```
{
  "data": [...],
  "meta": {
    "total": 50,
    "page": 2,
    "limit": 5,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": true
  },
  "links": {
    "first": "/api/tours?page=1&limit=5",
    "prev": "/api/tours?page=1&limit=5",
    "next": "/api/tours?page=3&limit=5",
    "last": "/api/tours?page=10&limit=5"
  }
}
```

### 4. API Documentation
 Swagger UI: https://web-full-itmo-course.onrender.com/api-docs

### 5. Error Responses
|Status |	Description|
|--------|----------|
|400    | Validation failed
|404	|Resource not found
|409	|Duplicate entry
|500	|Internal server error

---

## Migration and Seeding

### Apply database schema
npx prisma migrate dev --name init

### Seed initial tour data
npx prisma db seed

---

## Local Setup and Installation

### Prerequisites

- Node.js 22+
- npm 10+
- PostgreSQL (local or Render PostgreSQL)

### Steps

```
# 1. Clone repository
git clone https://github.com/nguyenduongitmo/Web_full_ITMO_course.git
cd Web_full_ITMO_course

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Configure database in .env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# 5. Run migrations
npx prisma migrate dev --name init

# 6. Seed database
npx prisma db seed

# 7. Start application (development)
npm run start:dev

# 8. Open browser
http://localhost:3000
```

## Compile and run

Development
```
npm run start
```

Watch mode
```
npm run start:dev
```

Production mode
```
npm run start:prod
```

## Run tests
Unit tests
```
npm run test
```

E2e tests
``` 
npm run test:e2e
 ```

Test coverage
``` 
npm run test:cov
```

## Deployment
The project is deployed on Render.

## Build Command
```
npm install && npx prisma generate && npm run build
```
## Start Command
```
npm run start:prod
```

### Lab Progress

|Lab	| Content	| Points	| Status
|-------|-----------|-----------|-------|
|Lab 1	|Deploy on Render and Templating|	10|	Completed
|Lab 2	|Domain Model and Database	|12	|Completed
|Lab 3	|CRUD + SSE	| 12|	Completed
|Lab 4	|RESTful API + Swagger|	12|	Completed
|Lab 5	|GraphQL	|12|	Pending
|Lab 6	|BFF + Caching	|10|	Pending
|Lab 7	|Authentication	|12|	Pending
|TOTAL	||	80	

