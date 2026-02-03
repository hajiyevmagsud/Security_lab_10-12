# Security Labs Backend - API Documentation

Complete API documentation for the Security Labs Node.js backend application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token stored in HTTP-only cookie. The token is automatically set upon successful login or registration.

### Cookie Details

Users receive two cookies upon authentication:

- **jwt**:
  - **Type**: Access Token (short-lived, e.g., 15m)
  - **HTTP-only**: Yes
  - **SameSite**: Strict
  - **Secure**: Yes (production)
- **refreshToken**:
  - **Type**: Refresh Token (long-lived, e.g., 7d)
  - **HTTP-only**: Yes
  - **SameSite**: Strict
  - **Secure**: Yes (production)
  - **Path**: `/api/auth/refresh-token` (restricted boundary)

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass@123"
}
```

**Password Requirements**:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not in common passwords list

**Success Response** (201):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "USER",
    "createdAt": "2024-01-11T12:00:00.000Z"
  }
}
```

**Error Responses**:

- `400`: Validation failed
- `409`: Email or username already exists

---

### Login

Authenticate user and receive JWT token.

**Endpoint**: `POST /api/auth/login`

**Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "USER",
    "createdAt": "2024-01-11T12:00:00.000Z"
  }
}
```

**Error Responses**:

- `400`: Validation failed
- `401`: Invalid credentials
- `403`: Account deactivated

---

### Get Current User

Get authenticated user information.

**Endpoint**: `GET /api/auth/me`

**Access**: Protected (requires authentication)

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "USER",
    "createdAt": "2024-01-11T12:00:00.000Z"
  }
}
```

**Error Responses**:

- `401`: Not authenticated

---

### Logout

Clear authentication token.

**Endpoint**: `POST /api/auth/logout`

**Access**: Protected

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful",
  "data": null
}
```

---

### Refresh Token

Refresh the Access Token using the Refresh Token cookie. This endpoint implements **token rotation**, meaning a new refresh token is issued and the old one is invalidated.

**Endpoint**: `POST /api/auth/refresh-token`

**Access**: Public (uses `refreshToken` cookie)

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "USER",
    "createdAt": "2024-01-11T12:00:00.000Z"
  }
}
```

**Error Responses**:

- `401`: Refresh token missing, expired, or invalid.

---

## User Endpoints

### Get Profile

Get current user profile.

**Endpoint**: `GET /api/users/profile`

**Access**: Protected

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "USER",
    "createdAt": "2024-01-11T12:00:00.000Z"
  }
}
```

---

### Update Profile

Update current user profile.

**Endpoint**: `PUT /api/users/profile`

**Access**: Protected

**Request Body**:

```json
{
  "username": "newusername"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "newusername",
    "role": "USER",
    "createdAt": "2024-01-11T12:00:00.000Z"
  }
}
```

**Error Responses**:

- `400`: Validation failed
- `409`: Username already taken

---

### Delete Account

Delete current user account.

**Endpoint**: `DELETE /api/users/profile`

**Access**: Protected

**Success Response** (204): No content

---

### Get All Users (Admin)

Get list of all users.

**Endpoint**: `GET /api/users`

**Access**: Protected (Admin only)

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (USER, ADMIN)
- `isActive` (optional): Filter by active status (true, false)

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error Responses**:

- `401`: Not authenticated
- `403`: Insufficient permissions

---

## Note Endpoints

### Create Note

Create a new note.

**Endpoint**: `POST /api/notes`

**Access**: Protected

**Request Body**:

```json
{
  "title": "My Note",
  "content": "This is the content of my note."
}
```

**Success Response** (201):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Note created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "title": "My Note",
    "content": "This is the content of my note.",
    "userId": "507f1f77bcf86cd799439011",
    "isArchived": false,
    "createdAt": "2024-01-11T12:00:00.000Z",
    "updatedAt": "2024-01-11T12:00:00.000Z"
  }
}
```

**Error Responses**:

- `400`: Validation failed
- `401`: Not authenticated

---

### Get User Notes

Get all notes for current user.

**Endpoint**: `GET /api/notes`

**Access**: Protected

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `isArchived` (optional): Filter by archived status (true, false)
- `search` (optional): Search in title and content

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Notes retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### Get Note by ID

Get a specific note.

**Endpoint**: `GET /api/notes/:id`

**Access**: Protected (owner or admin)

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Note retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "title": "My Note",
    "content": "This is the content of my note.",
    "userId": "507f1f77bcf86cd799439011",
    "isArchived": false,
    "createdAt": "2024-01-11T12:00:00.000Z",
    "updatedAt": "2024-01-11T12:00:00.000Z"
  }
}
```

**Error Responses**:

- `401`: Not authenticated
- `404`: Note not found (or not owned by user)

---

### Update Note

Update a note.

**Endpoint**: `PUT /api/notes/:id`

**Access**: Protected (owner or admin)

**Request Body**:

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "isArchived": true
}
```

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Note updated successfully",
  "data": {...}
}
```

**Error Responses**:

- `400`: Validation failed
- `401`: Not authenticated
- `404`: Note not found (or not owned by user)

---

### Delete Note

Delete a note.

**Endpoint**: `DELETE /api/notes/:id`

**Access**: Protected (owner or admin)

**Success Response** (204): No content

**Error Responses**:

- `401`: Not authenticated
- `404`: Note not found (or not owned by user)

---

### Get All Notes (Admin)

Get all notes from all users.

**Endpoint**: `GET /api/notes/admin/all`

**Access**: Protected (Admin only)

**Query Parameters**:

- `page` (optional): Page number
- `limit` (optional): Items per page
- `userId` (optional): Filter by user ID
- `isArchived` (optional): Filter by archived status

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All notes retrieved successfully",
  "data": [...],
  "pagination": {...}
}
```

---

## Demo Endpoints (Lab 10)

### Read Headers

Demonstrate header reading.

**Endpoint**: `GET /api/demo/headers`

**Access**: Public

**Headers**: Any custom headers (e.g., `X-Custom-Header`)

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Headers retrieved successfully",
  "data": {
    "user-agent": "...",
    "content-type": "...",
    "accept": "...",
    "host": "...",
    "custom-header": "...",
    "all-headers": {...}
  }
}
```

---

### Parse JSON

Demonstrate JSON parsing and validation.

**Endpoint**: `POST /api/demo/json`

**Access**: Public

**Request Body**:

```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "JSON parsed successfully",
  "data": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com"
  }
}
```

**Error Responses**:

- `400`: Validation failed

---

### Parse Form Data

Demonstrate form data parsing.

**Endpoint**: `POST /api/demo/form`

**Access**: Public

**Content-Type**: `application/x-www-form-urlencoded`

**Request Body**: `key1=value1&key2=value2`

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Form data parsed successfully",
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

---

### File Upload

Demonstrate multipart file upload.

**Endpoint**: `POST /api/demo/upload`

**Access**: Protected

**Content-Type**: `multipart/form-data`

**Form Field**: `file` (max 5MB, allowed types: jpeg, jpg, png, gif, pdf, txt)

**Success Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "File uploaded successfully",
  "data": {
    "originalName": "document.pdf",
    "filename": "file-1234567890-123456789.pdf",
    "mimetype": "application/pdf",
    "size": 102400,
    "path": "uploads/file-1234567890-123456789.pdf"
  }
}
```

**Error Responses**:

- `400`: No file uploaded
- `415`: Unsupported file type

---

### Test Status Codes

Return specified HTTP status code.

**Endpoint**: `GET /api/demo/status/:code`

**Access**: Public

**Parameters**:

- `code`: HTTP status code (200, 201, 204, 400, 401, 403, 404, 415, 500)

**Example**: `GET /api/demo/status/404`

**Success Response**: Returns specified status code with appropriate message

---

### Test Error Handling

Trigger different types of errors.

**Endpoint**: `GET /api/demo/error`

**Access**: Public

**Query Parameters**:

- `type`: Error type (validation, unauthorized, forbidden, notfound, server)

**Example**: `GET /api/demo/error?type=validation`

**Response**: Returns error with specified type

---

### Test Content Types

Demonstrate different content types.

**Endpoint**: `GET /api/demo/content-type`

**Access**: Public

**Query Parameters**:

- `format`: Response format (json, xml, text, html)

**Example**: `GET /api/demo/content-type?format=xml`

**Response**: Returns data in specified format

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required",
      "value": ""
    }
  ]
}
```

**Note**: `errors` field is optional and only included for validation errors.

**Development vs Production**:
- In `NODE_ENV=development`, error responses include a `stack` field for debugging.
- In other environments (test/production), stack traces are not included in API responses.

---

## Common Status Codes

- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `415`: Unsupported Media Type
- `500`: Internal Server Error

---

## Security Features

1. **Password Hashing**: bcrypt with strength 12.
2. **Refresh Token Rotation**: Short-lived access tokens and rotated refresh tokens stored in DB.
3. **Session Invalidation**: Server-side session/token destruction on logout.
4. **JWT Tokens**: Stored in HTTP-only, Secure, SameSite: Strict cookies.
5. **Rate Limiting**:
   - General: 100 requests / 15 mins.
   - Auth: 5 failed attempts / 15 mins.
6. **NoSQL Injection Prevention**: Input sanitization via `express-mongo-sanitize`.
7. **XSS Prevention**: Input escaping and strict CSP.
8. **Security Headers**: Strict Helmet configuration (HSTS, CSP, Frameguard, etc.).
9. **Transport Security**: HTTPS support with automatic HTTP to HTTPS redirection.
10. **Secure Logging**: Winston-based structured logging for security events with log rotation.
11. **Automated Tests**: Unit + integration tests with Jest and Supertest, including security-related cases.
12. **Coverage Reporting**: Jest coverage reports (`npm run test:coverage`) output to `coverage/`.
13. **CI Pipeline**: GitHub Actions runs tests and coverage on push/PR (`.github/workflows/ci.yml`).
14. **Dependency Scanning**: OWASP Dependency Check in CI with failure on high severity vulnerabilities.

---

## Testing and CI

### Local Test Commands

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
```

### Coverage Reports

Coverage output is generated in the `coverage/` directory (text + lcov).

### CI (GitHub Actions)

Workflow file: `.github/workflows/ci.yml`

Runs:
- `npm ci`
- `npm run test:coverage`
- OWASP Dependency Check (fails on high severity vulnerabilities)

---

## Postman Collection

A ready-to-run Postman collection is available at:

```
postman/security-labs.postman_collection.json
```

It includes requests for registration/login, validation failures, secured endpoints, role checks,
token refresh/rotation, and user data isolation tests.
