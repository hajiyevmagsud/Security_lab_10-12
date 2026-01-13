# Security Labs Backend

A comprehensive Node.js REST API demonstrating HTTP fundamentals, authentication, authorization, and secure data layer practices for security course labs (Labs 10-12).

## 📋 Overview

This project implements a production-ready backend covering:

- **Lab 10**: HTTP request/response handling, validation, proper status codes
- **Lab 11**: JWT-based authentication with HTTP-only cookies
- **Lab 12**: Role-based access control and secure CRUD operations

## 🚀 Features

### Security

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcrypt (strength 12)
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ NoSQL injection prevention
- ✅ XSS protection
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet security headers
- ✅ CORS configuration

### HTTP Fundamentals (Lab 10)

- ✅ Header reading and parsing
- ✅ JSON body parsing
- ✅ Form data handling (application/x-www-form-urlencoded)
- ✅ Multipart file uploads
- ✅ Proper HTTP status codes (200, 201, 204, 400, 401, 403, 404, 415, 500)
- ✅ Structured error responses
- ✅ Content-Type handling

### Authentication & Authorization (Lab 11)

- ✅ User registration with password policy
- ✅ Login with JWT token generation
- ✅ HTTP-only cookie storage
- ✅ Token verification middleware
- ✅ Role-based route protection
- ✅ Session management (logout, refresh)

### Secure Data Layer (Lab 12)

- ✅ MongoDB with Mongoose ODM
- ✅ User ownership enforcement
- ✅ Access control on all CRUD operations
- ✅ Validation at model and DTO levels
- ✅ Prevention of mass assignment
- ✅ Safe error messages (no information disclosure)

## 🛠 Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **File Upload**: multer
- **Security**: helmet, express-rate-limit, express-mongo-sanitize

## 📁 Project Structure

```
security-labs-backend/
├── src/
│   ├── config/          # Database, JWT, security configuration
│   ├── models/          # Mongoose models (User, Note)
│   ├── dto/             # Data Transfer Objects with validation
│   ├── validators/      # Custom validators (password policy, etc.)
│   ├── middleware/      # Auth, RBAC, validation, error handling
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic with access control
│   ├── routes/          # Route definitions
│   ├── utils/           # Utilities (ApiError, ApiResponse, Logger)
│   ├── migrations/      # Database initialization scripts
│   └── app.js           # Express app configuration
├── server.js            # Server entry point
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or cloud instance)

### Installation

1. **Navigate to project directory**:

   ```bash

   ```

2. **Install dependencies** (already done):

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   The `.env` file is already created from `.env.example`. Update if needed:

   ```bash
   # Server
   PORT=3000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/security-labs

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_COOKIE_EXPIRES_IN=1

   # Bcrypt
   BCRYPT_ROUNDS=12
   ```

4. **Start MongoDB**:

   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud) and update MONGODB_URI
   ```

5. **Initialize database** (create admin and test users):

   ```bash
   npm run init-db
   ```

   This creates:

   - Admin user: `admin@example.com` / `Admin@123456`
   - Test user: `user@example.com` / `User@123456`

6. **Start the server**:

   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

7. **Verify server is running**:
   ```bash
   curl http://localhost:3000/health
   ```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Start Examples

**Register a user**:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser",
    "password": "SecurePass@123"
  }' \
  -c cookies.txt
```

**Login**:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "User@123456"
  }' \
  -c cookies.txt
```

**Create a note** (requires authentication):

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My First Note",
    "content": "This is a secure note!"
  }'
```

**Get user notes**:

```bash
curl http://localhost:3000/api/notes -b cookies.txt
```

## ✅ Lab Checklist Coverage

### Lab 10: HTTP Fundamentals

- ✅ API documentation with methods, paths, params, status codes
- ✅ GET, POST endpoints implemented
- ✅ PUT, DELETE, PATCH endpoints implemented
- ✅ Read headers using custom middleware
- ✅ Parse JSON using DTOs and express-validator
- ✅ Parse form data (application/x-www-form-urlencoded)
- ✅ Parse multipart data (file uploads)
- ✅ DTOs with validation annotations (@NotNull equivalent)
- ✅ Custom validators (password policy, username rules)
- ✅ Validation errors return 400 with structured JSON
- ✅ Proper status codes (200, 201, 204, 400, 401, 403, 404, 415, 500)
- ✅ Correct Content-Type headers
- ✅ Global exception handling

### Lab 11: Authentication

- ✅ Custom user authentication service
- ✅ Security configuration (helmet, CORS, rate limiting)
- ✅ Public routes (/auth/login, /auth/register)
- ✅ Protected routes (all /api/users/_, /api/notes/_)
- ✅ Password hashing with bcrypt (strength 12)
- ✅ JWT token generation on login
- ✅ JWT stored in HTTP-only cookie
- ✅ JWT verification on every protected request
- ✅ Token validation middleware
- ✅ Role definitions (USER, ADMIN)
- ✅ Route protection with role requirements
- ✅ 401/403 responses for unauthorized access
- ✅ Safe error messages (no stack traces in production)

### Lab 12: Secure Data Layer

- ✅ Database schema (User, Note models)
- ✅ Foreign key relationship (Note.userId → User)
- ✅ Mongoose ODM with validation
- ✅ Entity validation at model level
- ✅ DTO validation for input
- ✅ Prevention of mass assignment
- ✅ CRUD operations implemented
- ✅ Access control: users can only access own data
- ✅ Proper 404 for accessing others' resources
- ✅ NoSQL injection prevention (mongo-sanitize)
- ✅ Global error handler with safe messages
- ✅ Proper HTTP status codes

## 🔐 Password Policy

The system enforces a strong password policy:

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&\*()\_+-=[]{};\':"|,.<>/?)
- Not in common passwords list (top 100)

## 🎯 Testing Endpoints

### Test Lab 10 Features

```bash
# Test header reading
curl http://localhost:3000/api/demo/headers \
  -H "X-Custom-Header: test-value"

# Test JSON parsing
curl -X POST http://localhost:3000/api/demo/json \
  -H "Content-Type: application/json" \
  -d '{"name":"John","age":30,"email":"john@example.com"}'

# Test form data
curl -X POST http://localhost:3000/api/demo/form \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "key1=value1&key2=value2"

# Test status codes
curl http://localhost:3000/api/demo/status/404

# Test error handling
curl http://localhost:3000/api/demo/error?type=validation
```

### Test Authentication

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"Test@123456"}' \
  -c cookies.txt

# Get current user (requires auth)
curl http://localhost:3000/api/auth/me -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

### Test Access Control

```bash
# Login as user A
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"User@123456"}' \
  -c user_a.txt

# Create note as user A
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -b user_a.txt \
  -d '{"title":"User A Note","content":"Private content"}'

# Login as user B
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}' \
  -c user_b.txt

# Try to access user A's notes as user B (should get empty list or 404)
curl http://localhost:3000/api/notes -b user_b.txt
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Make sure MongoDB is running. Start it with `mongod` or update `MONGODB_URI` to point to your MongoDB instance.

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: Change the `PORT` in `.env` file or kill the process using port 3000.

### JWT Secret Warning

**Solution**: In production, change `JWT_SECRET` in `.env` to a strong random string.

## 📝 Notes

- **Development Mode**: Stack traces are included in error responses
- **Production Mode**: Set `NODE_ENV=production` for safe error messages
- **Rate Limiting**: Default is 100 requests per 15 minutes per IP
- **File Uploads**: Maximum 5MB, stored in `uploads/` directory
- **Cookie Security**: In production, cookies are sent only over HTTPS

## 🎓 Learning Objectives Covered

This project demonstrates:

1. ✅ Proper HTTP request/response handling
2. ✅ Input validation and sanitization
3. ✅ Secure authentication with JWT
4. ✅ Role-based authorization
5. ✅ Access control enforcement
6. ✅ Prevention of common vulnerabilities (XSS, NoSQL injection, mass assignment)
7. ✅ Proper error handling and status codes
8. ✅ Security best practices (password hashing, HTTP-only cookies, rate limiting)

## 📄 License

This project is for educational purposes as part of a security course.

## 👤 Author

Created for Security Labs (Labs 10-12)
