# Project Architecture Documentation

## Overview

This project is a **Node.js REST API** built with **Express** and **MongoDB**. It follows a standard **Layered Architecture** (often referred to as Controller-Service-Model), which separates concerns to make the code modular, maintainable, and secure.

---

## 1. Core Concepts: The "Big Three"

### 🛠️ Routes ("The Traffic Cops")

**Location:** `src/routes/`
Routes are the entry points of your application. They are responsible for determining "where" a request should go based on the URL and HTTP method.

- **Logic:**
  1.  **Listen**: They wait for requests on specific paths (e.g., `/api/users/profile`).
  2.  **Verify**: They run "Middleware" first to check if you are allowed in (e.g., `authenticate` checks your login token, `validate` checks your data format).
  3.  **Direct**: If everything is okay, they pass the request to a specific **Controller** function.
- **Example from specific file (`user.routes.js`)**:
  ```javascript
  // 1. Define the path and method (PUT /profile)
  // 2. Run checks (authenticate user, validate input data)
  // 3. Call the controller (userController.updateProfile)
  router.put(
    "/profile",
    authenticate,
    validate(updateProfileValidation),
    userController.updateProfile,
  );
  ```

### 🧠 Controllers ("The Managers")

**Location:** `src/controllers/`
Controllers handle the "flow" of a specific request. They don't usually do the heavy lifting (database math); instead, they coordinate the work.

- **Logic:**
  1.  **Receive**: They get the Request object (`req`) containing user data.
  2.  **Delegate**: They ask the **Service** layer to perform the actual business task (e.g., "Service, please update this user's name").
  3.  **Respond**: Once the task is done, they format the result into a standard JSON response (`res`) and send it back to the client.
  4.  **Error Handling**: If something goes wrong, they catch the error and pass it to the global error handler.
- **Example from specific file (`user.controller.js`)**:
  ```javascript
  updateProfile = asyncHandler(async (req, res) => {
    // Delegate: Ask service to update user with ID from token and data from body
    const user = await userService.updateUser(req.user._id, req.body);

    // Respond: Send back 200 OK and the updated user data
    res
      .status(200)
      .json(ApiResponse.success(200, user, "Profile updated successfully"));
  });
  ```

### 🏗️ Models ("The Blueprints")

**Location:** `src/models/`
Models define the **structure** of your data and how it interacts with the database (MongoDB). This project uses **Mongoose** to define these schemas.

- **Logic:**
  1.  **Schema Definition**: Rules for what a user looks like (e.g., "Email is required," "Password must be 8 chars").
  2.  **Sanitization**: Logic to keep data clean (e.g., `trim: true` removes spaces).
  3.  **Hooks**: Automatic actions. For example, `pre('save')` automatically runs code to **hash the password** before saving a user to the database.
  4.  **Methods**: Helper functions attached to data (e.g., `comparePassword` checks if a login password matches the hashed one).
- **Example from specific file (`User.js`)**:
  ```javascript
  const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true }, // Rule: Unique email
      password: { type: String, select: false } // Rule: Don't return password by default
  });
  // Hook: Encrypt password before saving
  userSchema.pre('save', async function(next) { ... });
  ```

---

## 2. The Flow of a Request

When a user updates their profile, this is the chain of events:

1.  **Browser/Postman** sends `PUT /api/users/profile`.
2.  **Route** (`user.routes.js`) sees the request.
    - Checks Token (Is this user logged in?).
    - Checks Body (Is the new username valid?).
    - Forwards to **Controller**.
3.  **Controller** (`user.controller.js`) receives the clean request.
    - Calls `userService.updateUser()`.
4.  **Service** (`user.service.js`) contains the business rules.
    - Checks if the new username is already taken by someone else (Logic!).
    - Calls **Model** (`User.findByIdAndUpdate`).
5.  **Model** (`User.js`) talks to MongoDB to save the change.
6.  **Response** travels all the way back up to the Controller, which sends JSON back to the user.

---

## 3. Answering Your Questions

### Is it MVC?

**Yes, technically.**

- **Model**: The Mongoose Schemas (`src/models`).
- **View**: The JSON Response sent by the API. (In traditional web apps, this would be HTML, but in APIs, the "View" is the data representation).
- **Controller**: The files in `src/controllers`.
- _Note_: This project adds a **Service Layer** (`src/services`), which is a professional best practice to keep Controllers clean. A more accurate name would be "Controller-Service-Model".

### Is it a REST API?

**Yes.**

- **Resources**: It exposes resources like Users and Notes via URLs (e.g., `/users`, `/notes`).
- **HTTP Methods**: It uses the correct verbs for actions:
  - `GET` to read data.
  - `POST` to create data.
  - `PUT` to update data.
  - `DELETE` to remove data.
- **Stateless**: It uses **JWT (JSON Web Tokens)** for authentication, meaning the server doesn't "remember" the user session; the user asserts identity with every request.

---

## 4. Advanced Security Features (Lab 13)

To ensure high-level security, the project includes several hardening techniques:

### 🔐 Session & Token Management

- **Refresh Token Rotation**: Uses a short-lived Access Token (JWT) and a longer-lived Refresh Token. Every time a new Access Token is requested, the old Refresh Token is invalidated and a new one is issued (rotation).
- **Logout Invalidation**: On logout, the server-side Refresh Token is deleted from the database, preventing any future access with that session.
- **Secure Cookies**: Authentication tokens are stored in `HttpOnly`, `Secure`, and `SameSite: Strict` cookies to prevent XSS and CSRF attacks.

### 🛡️ Security Headers

The application uses **Helmet.js** to enforce strict security headers:

- **Content Security Policy (CSP)**: Controls which resources (scripts, styles, etc.) can be loaded.
- **HSTS (Strict-Transport-Security)**: Instructs browsers to always use HTTPS.
- **X-Frame-Options: DENY**: Prevents clickjacking by forbidding the site from being embedded in iframes.
- **X-Content-Type-Options: nosniff**: Prevents MIME-type sniffing.

### 📊 Secure Logging

- **Structured Logging**: Uses **Winston** for capturing system and security events.
- **Security Audit**: Logs failed login attempts, unauthorized access requests, and suspicious token activities without leaking sensitive info (passwords/PII).
- **Log Rotation**: Errors and combined logs are saved to the `logs/` directory for auditing.

### 🚦 Rate Limiting

- **General Limiter**: Prevents DoS attacks by limiting requests to 100 per 15 minutes per IP.
- **Auth Limiter**: Specifically protects `/api/auth` endpoints by limiting failed login attempts to 5 per 15 minutes, mitigating brute-force attacks.

### 🌐 Transport Security (HTTPS)

- **HTTPS Support**: The server can run over TLS (port 3443 using certificates in `certs/`).
- **Automatic Redirection**: In production, all insecure HTTP traffic is automatically redirected to HTTPS.
