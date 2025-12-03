# JWT Authentication & Authorization Guide

## Overview

This application uses JWT (JSON Web Tokens) for authentication and role-based access control (RBAC) for authorization.

## Backend Security Setup

### 1. Authentication Middleware (`server/src/middleware/authMiddleware.js`)

**`protect` middleware**: Verifies JWT token and attaches user to request

- Checks for `Authorization: Bearer <token>` header
- Verifies token using JWT_SECRET
- Loads user from database (excluding password)
- Returns 401 if token is missing/invalid

**`authorize(...roles)` middleware**: Role-based access control

- Must be used AFTER `protect` middleware
- Checks if user's role is in allowed roles list
- Returns 403 if user doesn't have permission

**`extractUser` middleware**: Optional authentication

- Tries to load user if token present
- Doesn't fail if no token (for public/admin routes)

### 2. Protected Routes

**Company Routes** (`/api/company`)

- `GET /` - Get own profile (requires: manufacturer, distributor, or retailer)
- `POST /` - Create/update profile (requires: manufacturer, distributor, or retailer)
- `GET /all` - Admin only (public for now)
- `PATCH /:id/status` - Admin only (public for now)
- `DELETE /:id` - Admin only (public for now)

**Requirement Routes** (`/api/requirements`)

- `GET /` - List all (public)
- `GET /my-requirements` - Get own requirements (requires: manufacturer)
- `GET /:id` - View single requirement (public)
- `POST /` - Create requirement (requires: manufacturer)
- `PUT /:id` - Update requirement (uses extractUser)
- `DELETE /:id` - Delete requirement (uses extractUser)

**Auth Routes** (`/api/auth`)

- `POST /register` - Register new user (public)
- `POST /login` - Login (public)

## Frontend Security Setup

### 1. Protected Routes (`client/src/components/ProtectedRoute.jsx`)

**Features:**

- Verifies user is logged in (checks localStorage for userInfo)
- Validates JWT token by making API call to backend
- Checks user role matches allowed roles
- Shows loading state during verification
- Redirects to `/login` if:
  - No token found
  - Token is expired/invalid
  - Token verification fails
- Redirects to user's home page if accessing wrong role's route

### 2. Axios Interceptors (`client/src/api/axiosClient.js`)

**Request Interceptor:**

- Automatically attaches JWT token to all API requests
- Format: `Authorization: Bearer <token>`

**Response Interceptor:**

- Handles 401 (Unauthorized): Clears token, redirects to login
- Handles 403 (Forbidden): Redirects to user's home page
- Prevents expired/invalid tokens from being used

### 3. Auth Context (`client/src/context/AuthContext.jsx`)

**Features:**

- Provides `login()`, `register()`, `logout()` functions
- Stores JWT token in localStorage as `userInfo`
- Format: `{ _id, name, email, role, token }`

## How It Works

### Registration Flow

1. User fills registration form with role selection
2. POST `/api/auth/register` with { name, email, password, role }
3. Backend creates user + empty company profile (for manufacturer/distributor/retailer)
4. Returns JWT token + user info
5. Frontend stores in localStorage and redirects to role-specific home

### Login Flow

1. User enters email, password, and role
2. POST `/api/auth/login` with { email, password, role }
3. Backend verifies credentials + role match
4. Returns JWT token + user info
5. Frontend stores in localStorage and redirects to role-specific home

### Protected Page Access

1. User navigates to protected route (e.g., `/manufacturer/profile`)
2. `ProtectedRoute` component checks:
   - Token exists in localStorage
   - Token is valid (makes API call)
   - User role matches allowed roles
3. If all checks pass, render page
4. If any check fails, redirect to login

### API Call Flow

1. Frontend makes API request (e.g., `axiosClient.get('/company')`)
2. Request interceptor attaches JWT token to headers
3. Backend `protect` middleware verifies token
4. Backend `authorize` middleware checks user role
5. If authorized, process request and return response
6. If unauthorized (401/403), response interceptor:
   - Clears invalid token
   - Redirects user to login or their home page

## Security Features

✅ **Token Expiration**: Tokens expire after 30 days
✅ **Role-Based Access Control**: Users can only access routes for their role
✅ **Automatic Token Validation**: Every protected route verifies token on load
✅ **401/403 Handling**: Invalid tokens automatically trigger logout
✅ **Password Hashing**: Passwords hashed with bcrypt before storage
✅ **Token in Header**: Tokens sent in Authorization header (not URL/query params)

## Testing JWT Security

### Test 1: Role-Based Access

```bash
# Try to access manufacturer profile as distributor (should fail)
# 1. Login as distributor
# 2. Try to visit http://localhost:5173/manufacturer/profile
# Expected: Redirect to /distributor/home
```

### Test 2: Invalid Token

```bash
# 1. Login successfully
# 2. Open DevTools > Application > Local Storage
# 3. Modify the token value to something invalid
# 4. Refresh page or make API call
# Expected: Redirect to /login
```

### Test 3: Expired Token

```bash
# 1. Login successfully
# 2. Wait 30 days (or modify JWT_SECRET on server to invalidate all tokens)
# 3. Try to access protected route
# Expected: Redirect to /login
```

### Test 4: No Token

```bash
# 1. Clear browser localStorage
# 2. Try to visit http://localhost:5173/manufacturer/profile
# Expected: Redirect to /login
```

## Common Issues & Solutions

**Issue**: "Not authorized, token failed"

- **Cause**: Token expired or JWT_SECRET changed
- **Solution**: Login again to get new token

**Issue**: "User role X is not authorized to access this resource"

- **Cause**: Trying to access route for different role
- **Solution**: User will be redirected to their role's home page

**Issue**: "Cannot connect to server"

- **Cause**: Backend server not running
- **Solution**: Start server with `npm start` in server directory

**Issue**: Infinite redirect loop

- **Cause**: ProtectedRoute verification failing repeatedly
- **Solution**: Clear localStorage and login again

## Environment Variables

**Server** (`server/.env`):

```env
JWT_SECRET=some_super_secret_key_123
```

⚠️ **IMPORTANT**: Change this to a long random string in production!

## API Endpoint Authorization Matrix

| Endpoint                            | Method | Auth Required | Allowed Roles                       |
| ----------------------------------- | ------ | ------------- | ----------------------------------- |
| `/api/auth/register`                | POST   | No            | All                                 |
| `/api/auth/login`                   | POST   | No            | All                                 |
| `/api/company`                      | GET    | Yes           | manufacturer, distributor, retailer |
| `/api/company`                      | POST   | Yes           | manufacturer, distributor, retailer |
| `/api/company/all`                  | GET    | No            | All (Admin)                         |
| `/api/requirements`                 | GET    | No            | All                                 |
| `/api/requirements/my-requirements` | GET    | Yes           | manufacturer                        |
| `/api/requirements/:id`             | GET    | No            | All                                 |
| `/api/requirements`                 | POST   | Yes           | manufacturer                        |

## Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Keep JWT_SECRET secure and never commit to git
3. ✅ Set appropriate token expiration (30 days default)
4. ✅ Clear tokens on logout
5. ✅ Validate tokens on every protected route access
6. ✅ Use role-based access control for sensitive operations
7. ✅ Handle 401/403 errors gracefully in frontend
8. ✅ Store tokens in localStorage (not cookies for this SPA setup)
