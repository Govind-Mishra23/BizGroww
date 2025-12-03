# 🔐 Authentication & Role Verification Flow

## How the System Identifies User Role

### 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. REGISTRATION PHASE                        │
└─────────────────────────────────────────────────────────────────┘

User clicks "Distributor" on Landing Page
         ↓
Register Page opens with role="distributor" (pre-selected)
         ↓
User fills: Name, Email, Password
         ↓
Backend receives: { name, email, password, role: "distributor" }
         ↓
Backend creates User in MongoDB:
   {
     _id: "67abc123...",
     name: "John Doe",
     email: "john@example.com",
     role: "distributor",  ← ROLE SAVED IN DATABASE
     password: "hashed_password"
   }
         ↓
Backend creates empty CompanyProfile:
   {
     user: "67abc123...",  ← Links to User._id
     companyName: "",
     ...
   }
         ↓
Backend returns JWT Token:
   {
     _id: "67abc123...",
     name: "John Doe",
     email: "john@example.com",
     role: "distributor",
     token: "eyJhbGciOiJIUzI1NiIs..."  ← JWT contains: { id: "67abc123..." }
   }
         ↓
Frontend saves to localStorage:
   userInfo = {
     _id: "67abc123...",
     email: "john@example.com",
     role: "distributor",
     token: "eyJh..."
   }


┌─────────────────────────────────────────────────────────────────┐
│                      2. LOGIN PHASE                             │
└─────────────────────────────────────────────────────────────────┘

User clicks "Distributor" on Landing Page
         ↓
Login Page opens with role="distributor" (pre-selected in dropdown)
         ↓
User enters: Email + Password
         ↓
Backend receives: { email: "john@example.com", password: "...", role: "distributor" }
         ↓
Backend finds User by email
         ↓
Backend verifies password (bcrypt)
         ↓
Backend checks: user.role === selected_role?
         ↓
    ┌─────────────────────┬─────────────────────┐
    │                     │                     │
   YES                   NO
    │                     │
    ↓                     ↓
 ✅ Login              ❌ ERROR 403
 Success              "Access denied.
    ↓                 This account is
Returns:             registered as
{                    distributor,
  _id: "...",        not manufacturer"
  role: "distributor",
  token: "..."       User CANNOT login
}
    ↓
Redirect to
/distributor/home


┌─────────────────────────────────────────────────────────────────┐
│                 3. TOKEN VERIFICATION PHASE                     │
└─────────────────────────────────────────────────────────────────┘

User navigates to /distributor/profile
         ↓
Frontend sends API request: GET /api/company
   Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1..." }
         ↓
Backend middleware (protect) extracts token
         ↓
Decode JWT token: { id: "67abc123..." }
         ↓
Find User in database by ID
         ↓
Attach user to request: req.user = {
   _id: "67abc123...",
   email: "john@example.com",
   role: "distributor"
}
         ↓
Backend middleware (authorize) checks:
   Is req.user.role in ['manufacturer', 'distributor', 'retailer']?
         ↓
    ┌─────────────────────┬─────────────────────┐
    │                     │                     │
   YES                   NO
    │                     │
    ↓                     ↓
 ✅ Proceed            ❌ ERROR 403
    ↓                 "Not authorized"
Controller executes:
CompanyProfile.findOne({ user: "67abc123..." })
         ↓
Returns profile data with verification:
{
  companyName: "ABC Distributors",
  user: "67abc123...",
  _userId: "67abc123...",  ← For frontend verification
  _userEmail: "john@example.com"
}
```

---

## 🎯 Key Security Points

### 1. **Role is Stored in Database**

```javascript
// When you register as "distributor":
User.create({
  name: "John",
  email: "john@example.com",
  role: "distributor",  ← THIS IS PERMANENT
  password: "hashed"
})
```

### 2. **JWT Token Does NOT Contain Role**

```javascript
// JWT payload only has user ID:
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Token payload: { id: "67abc123..." }
// NO ROLE in token! Role is fetched from database every time.
```

### 3. **Role is Verified on EVERY Request**

```javascript
// Backend middleware:
const decoded = jwt.verify(token, JWT_SECRET); // Gets { id: "..." }
const user = await User.findById(decoded.id); // Fetches user with role
req.user = user; // Now req.user has: _id, email, role
```

---

## 🚫 What Happens with Wrong Role?

### Scenario: User Registered as Distributor, Tries to Login as Manufacturer

**Step 1**: User registers

```
Email: john@example.com
Role: distributor  ← Saved in database
```

**Step 2**: User tries to login with wrong role

```javascript
// Login form:
Email: john@example.com
Password: correct_password
Selected Role: manufacturer  ← WRONG!

// Backend checks:
const user = await User.findOne({ email });
// user.role = "distributor"

if (role && user.role !== role) {
  // "manufacturer" !== "distributor"
  throw new Error("Access denied. This account is registered as a distributor, not manufacturer");
}
```

**Result**: ❌ Login FAILS with error message

---

## 📱 Frontend Role Selection

### Registration Form

```jsx
// RegisterPage.jsx
const role = location.state?.role || "manufacturer";
// Role comes from LandingPage button click
// User CANNOT change it during registration
```

**Registration shows**: "Register as a distributor" (not changeable)

### Login Form

```jsx
// LoginPage.jsx
const [selectedRole, setSelectedRole] = useState(role || "");
// User CAN select role from dropdown
// But backend will reject if it doesn't match database
```

**Login shows**: Role dropdown (manufacturer, distributor, retailer, candidate)

---

## 🔍 How System Verifies Token

### Every API Call:

```javascript
// 1. Extract token from header
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// 2. Decode token
{ id: "67abc123..." }

// 3. Fetch user from database
User.findById("67abc123...")
// Returns: { _id: "...", email: "...", role: "distributor" }

// 4. Attach to request
req.user = user

// 5. Verify role authorization
if (!['manufacturer', 'distributor', 'retailer'].includes(req.user.role)) {
  throw Error("Not authorized");
}

// 6. Fetch user-specific data
CompanyProfile.findOne({ user: req.user._id })
```

---

## 📊 Database Structure

### Users Collection

```javascript
{
  _id: ObjectId("67abc123..."),
  name: "John Doe",
  email: "john@example.com",
  role: "distributor",        ← SOURCE OF TRUTH
  password: "$2a$10$hashed..."
}
```

### CompanyProfiles Collection

```javascript
{
  _id: ObjectId("67xyz789..."),
  user: ObjectId("67abc123..."),  ← Links to User
  companyName: "ABC Distributors",
  businessModel: ["Distributor"],
  ...
}
```

**Relationship**: One User → One CompanyProfile (linked by user.\_id)

---

## 🧪 Test Cases

### ✅ VALID: Same Role Registration & Login

```
1. Register: email=john@example.com, role=distributor
2. Login: email=john@example.com, role=distributor
   Result: ✅ SUCCESS
```

### ❌ INVALID: Different Role Login

```
1. Register: email=john@example.com, role=distributor
2. Login: email=john@example.com, role=manufacturer
   Result: ❌ ERROR "Access denied. This account is registered as a distributor, not manufacturer"
```

### ❌ INVALID: Duplicate Email Different Role

```
1. Register: email=john@example.com, role=distributor
2. Register: email=john@example.com, role=manufacturer
   Result: ❌ ERROR "User already exists with this email as a distributor"
```

### ✅ VALID: Different Emails Same Role

```
1. Register: email=john@example.com, role=distributor
2. Register: email=jane@example.com, role=distributor
   Result: ✅ SUCCESS (2 separate distributor accounts)
```

---

## 🔐 Server Logs to Watch

### Registration Success

```
📝 Registration attempt: { name: 'John', email: 'john@example.com', role: 'distributor' }
✅ User created: john@example.com | Role: distributor | ID: 67abc123...
✅ Empty CompanyProfile created for user: john@example.com
```

### Login Success

```
🔐 Login attempt for: john@example.com | Selected role: distributor
✅ Login successful: john@example.com | Role: distributor
```

### Login Role Mismatch

```
🔐 Login attempt for: john@example.com | Selected role: manufacturer
❌ ROLE MISMATCH: User john@example.com is registered as distributor, but trying to login as manufacturer
```

### Token Verification

```
🔐 JWT Token received (first 20 chars): eyJhbGciOiJIUzI1NiIs...
🔓 JWT Decoded - User ID: 67abc123...
✅ User authenticated: john@example.com | Role: distributor
```

---

## 📝 Summary

| Step              | What Happens                        | Where Role Comes From                      |
| ----------------- | ----------------------------------- | ------------------------------------------ |
| **Registration**  | Role is saved to database           | LandingPage button → `location.state.role` |
| **Login**         | Role is verified against database   | User selects from dropdown (must match DB) |
| **Token**         | Token only contains user ID         | `jwt.sign({ id: user._id })`               |
| **API Calls**     | User fetched from DB using token ID | `User.findById(decoded.id)`                |
| **Authorization** | Role checked from `req.user.role`   | From database, NOT from token              |
| **Profile Fetch** | Filtered by `req.user._id`          | From database via token                    |

**Key Principle**:

- ✅ Role is stored in database (permanent)
- ✅ Token only has user ID (no role)
- ✅ Every request fetches user from database (includes role)
- ✅ Role mismatch = login denied
- ✅ Each user can only access their own data
