# JWT Authentication Implementation

## ✅ Backend Setup Complete

### Security Features Implemented:

1. **JWT Token Authentication**

   - Tokens expire in 30 days
   - Stored securely in localStorage on frontend
   - Automatically attached to requests via axios interceptor

2. **Protected Routes**

   - `/api/company` - GET, POST (requires authentication)
   - `/api/requirements` - POST, PUT, DELETE (requires authentication)
   - `/api/requirements` - GET, GET/:id (public for admin viewing)

3. **Automatic Company Association**

   - When a manufacturer creates a requirement, the backend automatically:
     - Verifies JWT token
     - Finds the user's company profile
     - Attaches the company ID to the requirement
     - Returns error if company profile doesn't exist

4. **Ownership Verification**
   - Update/Delete requirements: Only the owner (manufacturer) can modify
   - Returns 403 Forbidden if user tries to modify another manufacturer's requirement

---

## 📝 How to Test

### 1. Register a New Manufacturer

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Manufacturer",
    "email": "test@manufacturer.com",
    "password": "password123",
    "role": "manufacturer"
  }'
```

**Response:**

```json
{
  "_id": "...",
  "name": "Test Manufacturer",
  "email": "test@manufacturer.com",
  "role": "manufacturer",
  "token": "eyJhbGc..."
}
```

**Save the token!** You'll need it for subsequent requests.

---

### 2. Login (if already registered)

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@manufacturer.com",
    "password": "password123",
    "role": "manufacturer"
  }'
```

---

### 3. Create/Update Company Profile

```bash
curl -X POST http://localhost:5001/api/company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "companyName": "ABC Manufacturing",
    "industry": "Electronics",
    "businessModel": ["Manufacturer"],
    "companyType": "Pvt Ltd",
    "incorporationYear": "2020",
    "gstNumber": "27AAPFU0939F1ZV",
    "ownerName": "John Doe",
    "contactNumber": "9876543210",
    "email": "abc@example.com",
    "headOffice": {
      "state": "Maharashtra",
      "town": "Mumbai",
      "address": "123 Main St"
    }
  }'
```

---

### 4. Create a Requirement (Automatically Associates Company)

```bash
curl -X POST http://localhost:5001/api/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Need Distributors in North India",
    "targetAudience": "Distributor",
    "states": ["Delhi", "Punjab", "Haryana"],
    "towns": ["Delhi", "Chandigarh", "Gurgaon"],
    "marketingSupport": true,
    "supportOptions": {
      "marketingTeam": true,
      "branding": true
    },
    "notes": "Looking for experienced distributors"
  }'
```

**Note:** No need to pass `company` field - backend automatically sets it!

---

### 5. Update a Requirement (Only Owner Can Update)

```bash
curl -X PUT http://localhost:5001/api/requirements/REQUIREMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated: Need Distributors in North India",
    "status": "CLOSED"
  }'
```

---

### 6. Delete a Requirement (Only Owner Can Delete)

```bash
curl -X DELETE http://localhost:5001/api/requirements/REQUIREMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🖥️ Frontend Usage

### 1. User Flow:

1. **Landing Page** (`/`) → Select "Manufacturer"
2. **Register** (`/register`) → Create account with email/password
3. **Auto Redirect** → `/manufacturer/profile`
4. **Complete Profile** → Fill company details
5. **Create Requirements** → Go to `/manufacturer/requirements/create`

### 2. Automatic Token Handling:

The frontend automatically:

- Stores JWT token in `localStorage` after login/register
- Attaches token to all API requests via axios interceptor
- Redirects to login if token is missing/expired

### 3. Protected Routes:

All manufacturer routes require authentication:

- `/manufacturer/profile`
- `/manufacturer/requirements`
- `/manufacturer/requirements/create`
- `/manufacturer/gallery`
- `/manufacturer/certificates`

---

## 🔒 Security Benefits

✅ **Token-Based Auth**: Stateless, scalable  
✅ **Automatic Company Association**: No manual company ID needed  
✅ **Ownership Verification**: Users can only modify their own data  
✅ **Role-Based Access**: Different roles (manufacturer, distributor, etc.)  
✅ **Protected Routes**: Backend validates token on every request  
✅ **Secure Password**: Hashed with bcrypt before storing

---

## 🚀 Next Steps

1. Start the backend: `cd server && npm start`
2. Start the frontend: `cd client && npm run dev`
3. Navigate to `http://localhost:5173`
4. Register as a manufacturer
5. Complete your profile
6. Create requirements (company auto-attached!)

---

## 📌 Important Notes

- The JWT secret is in `.env` file: `JWT_SECRET=your_secret_key`
- Tokens expire in 30 days (configurable in `authController.js`)
- Company reference is **required** for all requirements
- Admin routes (`/admin/*`) are not yet JWT-protected (add later if needed)
