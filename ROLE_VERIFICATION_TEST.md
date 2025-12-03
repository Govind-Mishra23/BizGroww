# 🧪 Quick Test: Role Verification

## Test the Authentication Flow

### ✅ Test 1: Register as Distributor

1. Open browser: `http://localhost:5173`
2. Click **"Distributor"** button on landing page
3. Fill registration form:
   - Name: `Test Distributor`
   - Email: `dist@test.com`
   - Password: `Test123!`
   - (Role is auto-selected as "distributor")
4. Click **Register**

**Expected Server Logs**:

```
📝 Registration attempt: { name: 'Test Distributor', email: 'dist@test.com', role: 'distributor' }
✅ User created: dist@test.com | Role: distributor | ID: ...
✅ Empty CompanyProfile created for user: dist@test.com
```

**Expected Result**: Redirected to `/distributor/home`

---

### ❌ Test 2: Try to Login with Wrong Role (Should FAIL)

1. **Logout** from current session
2. Go to **Login** page
3. Select role: **"Manufacturer"** (WRONG - you registered as distributor!)
4. Enter credentials:
   - Email: `dist@test.com`
   - Password: `Test123!`
5. Click **Sign In**

**Expected Server Logs**:

```
🔐 Login attempt for: dist@test.com | Selected role: manufacturer
❌ ROLE MISMATCH: User dist@test.com is registered as distributor, but trying to login as manufacturer
```

**Expected Result**:

- ❌ Login FAILS
- Error message: **"Access denied. This account is registered as a distributor, not manufacturer. Please select the correct role or use a different account."**

---

### ✅ Test 3: Login with Correct Role (Should SUCCEED)

1. Stay on **Login** page
2. Select role: **"Distributor"** (CORRECT)
3. Enter credentials:
   - Email: `dist@test.com`
   - Password: `Test123!`
4. Click **Sign In**

**Expected Server Logs**:

```
🔐 Login attempt for: dist@test.com | Selected role: distributor
✅ Login successful: dist@test.com | Role: distributor
```

**Expected Result**:

- ✅ Login SUCCESS
- Redirected to `/distributor/home`

---

### ✅ Test 4: Access Profile with Token

1. Click **"Profile"** tab
2. Fill some profile data (company name, etc.)
3. Click **Save**

**Expected Server Logs**:

```
🔐 JWT Token received (first 20 chars): eyJhbGciOiJIUzI1NiIs...
🔓 JWT Decoded - User ID: ...
✅ User authenticated: dist@test.com | Role: distributor
🔍 Fetching profile for User ID: ...
👤 User Email: dist@test.com
🎭 User Role: distributor
💾 Saving profile for User ID: ...
✅ Company Profile Updated Successfully for: dist@test.com
```

**Expected Browser Console**:

```
✅ Profile verified for user: dist@test.com
```

---

### ❌ Test 5: Try to Register Same Email with Different Role

1. **Logout**
2. Go to **Landing Page**
3. Click **"Manufacturer"** button
4. Try to register:
   - Email: `dist@test.com` (SAME as before!)
   - Password: `NewPassword123!`
   - Role: manufacturer (DIFFERENT from before!)

**Expected Server Logs**:

```
📝 Registration attempt: { name: '...', email: 'dist@test.com', role: 'manufacturer' }
❌ Registration failed: Email dist@test.com already exists as distributor
```

**Expected Result**:

- ❌ Registration FAILS
- Error: **"User already exists with this email as a distributor"**

---

## 📊 Summary of Security Rules

| Scenario                             | Result      | Reason                             |
| ------------------------------------ | ----------- | ---------------------------------- |
| Register as distributor              | ✅ SUCCESS  | Valid new account                  |
| Login as distributor (correct role)  | ✅ SUCCESS  | Role matches database              |
| Login as manufacturer (wrong role)   | ❌ FAIL 403 | Role doesn't match database        |
| Register same email different role   | ❌ FAIL 400 | Email already exists               |
| Access profile with valid token      | ✅ SUCCESS  | Token verified, user ID matches    |
| Access profile with wrong user token | ❌ FAIL     | Frontend checks `_userId` mismatch |

---

## 🔍 Where to See Logs

### Server Terminal

Look for emoji logs (🔐, ✅, ❌, 🔍) to track authentication flow.

### Browser Console (F12)

Look for profile verification messages:

- `✅ Profile verified for user: ...`
- `❌ SECURITY ALERT: Profile mismatch!`

---

## 🎯 Key Takeaways

1. **Role is permanent**: Once you register with a role, you MUST use that role to login
2. **Email is unique**: One email can only have ONE account with ONE role
3. **Token contains only user ID**: Role is fetched from database on every request
4. **Every request is verified**: Token → User ID → Fetch User → Check Role → Check Data Ownership

**This ensures:**

- ❌ You cannot login as manufacturer if you registered as distributor
- ❌ You cannot see other users' profiles
- ❌ You cannot create multiple accounts with same email
- ✅ Each user can only access their own data with their assigned role
