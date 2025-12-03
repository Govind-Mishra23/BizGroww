# 🧪 Quick Security Test Script

## Test the Profile Isolation Fix

Follow these steps to verify each user sees only their own profile:

---

## 📋 Test Steps

### 1. Create First Test User

1. Open browser at `http://localhost:5173`
2. Click "Manufacturer" on landing page
3. Click "Register" (or go to signup)
4. Register with:
   - **Name**: Test User 1
   - **Email**: test1@example.com
   - **Password**: Test123!
   - **Role**: manufacturer

### 2. Create Profile for User 1

1. After login, you'll be at Manufacturer Home
2. Click "Profile" tab
3. Fill in:
   - **Company Name**: ABC Manufacturing Ltd
   - **Industry**: Manufacturing
   - **GST Number**: 12ABCDE3456F1Z1
   - **Owner Name**: Test Owner 1
4. Click "Save Profile"
5. **Check server terminal** - should see:
   ```
   💾 Saving profile for User ID: <some_id>
   👤 User Email: test1@example.com
   ✅ New Company Profile Created Successfully for: test1@example.com
   🏢 Updated Company Name: ABC Manufacturing Ltd
   ```

### 3. Logout User 1

1. Click "Logout" in navbar
2. You should be redirected to landing page

### 4. Create Second Test User

1. Click "Manufacturer" again
2. Click "Register"
3. Register with:
   - **Name**: Test User 2
   - **Email**: test2@example.com
   - **Password**: Test123!
   - **Role**: manufacturer

### 5. Create Profile for User 2

1. After login, click "Profile" tab
2. Fill in:
   - **Company Name**: XYZ Industries Corp
   - **Industry**: Manufacturing
   - **GST Number**: 98WXYZ9876M1N2
   - **Owner Name**: Test Owner 2
3. Click "Save Profile"
4. **Check server terminal** - should see:
   ```
   💾 Saving profile for User ID: <different_id>
   👤 User Email: test2@example.com
   ✅ New Company Profile Created Successfully for: test2@example.com
   🏢 Updated Company Name: XYZ Industries Corp
   ```

### 6. **CRITICAL TEST**: Switch Back to User 1

1. Logout
2. Login with test1@example.com / Test123!
3. Click "Profile" tab
4. **Expected Result**: Should see "ABC Manufacturing Ltd"
5. **Check server terminal**:
   ```
   🔐 JWT Token received
   🔓 JWT Decoded - User ID: <user1_id>
   ✅ User authenticated: test1@example.com | Role: manufacturer
   🔍 Fetching profile for User ID: <user1_id>
   ✅ Profile found for user: test1@example.com
   🏢 Company Name: ABC Manufacturing Ltd
   ```
6. **Check browser console** (F12):
   ```
   ✅ Profile verified for user: test1@example.com
   ```

### 7. **CRITICAL TEST**: Switch to User 2

1. Logout
2. Login with test2@example.com / Test123!
3. Click "Profile" tab
4. **Expected Result**: Should see "XYZ Industries Corp" (NOT "ABC Manufacturing Ltd")
5. **Check server terminal**: Should show user2's email and company name
6. **Check browser console**: Should show user2's email verification

---

## ✅ Success Criteria

### Backend (Server Terminal)

- [ ] Each user login shows **different User ID** in logs
- [ ] JWT Decoded shows **correct email** for each user
- [ ] Profile fetch shows **correct Company Name** for each user
- [ ] No errors or "SECURITY ALERT" messages

### Frontend (Browser Console - F12)

- [ ] Each profile load shows "✅ Profile verified for user: <correct_email>"
- [ ] No "❌ SECURITY ALERT: Profile mismatch!" errors
- [ ] Company name in form matches the logged-in user's company

### Database (Optional - MongoDB Compass)

```javascript
// Query: db.companyprofiles
// Expected: 2 documents with DIFFERENT "user" ObjectIds
[
  { user: ObjectId("...abc..."), companyName: "ABC Manufacturing Ltd" },
  { user: ObjectId("...xyz..."), companyName: "XYZ Industries Corp" },
];
```

---

## 🚨 If You See the Same Profile for Both Users

This means the bug still exists. Check:

1. **Server not restarted**: Make sure you ran `npm start` after code changes
2. **Browser cache**: Clear localStorage and cookies (F12 > Application > Clear storage)
3. **Wrong endpoint**: Verify frontend is calling `/api/company` not a cached version
4. **Database issue**: Check if both profiles have the same `user` field in MongoDB

### Debug Commands

**Check localStorage (Browser Console)**:

```javascript
console.log(JSON.parse(localStorage.getItem("userInfo")));
// Should show { _id: "...", email: "test1@example.com", token: "..." }
```

**Clear localStorage**:

```javascript
localStorage.clear();
// Then re-login
```

**Check server is using new code**:

- Look for emoji logs (🔐, ✅, 🔍) in server terminal
- If you see plain text logs, the old code is running

---

## 🎯 Test with Different Roles

Repeat the same test with:

### Distributor Test

- User 1: dist1@example.com → Company: "ABC Distributors"
- User 2: dist2@example.com → Company: "XYZ Supplies"

### Retailer Test

- User 1: retail1@example.com → Company: "ABC Retail Store"
- User 2: retail2@example.com → Company: "XYZ Mart"

All should show **role-specific profiles** without mixing data.

---

## 📊 Expected Server Logs Flow

**Login Request**:

```
🔐 JWT Token received (first 20 chars): eyJhbGciOiJIUzI1NiIs...
🔓 JWT Decoded - User ID: 67a1b2c3d4e5f6789012345
✅ User authenticated: test1@example.com | Role: manufacturer
```

**Profile Fetch**:

```
🔍 Fetching profile for User ID: 67a1b2c3d4e5f6789012345
👤 User Email: test1@example.com
🎭 User Role: manufacturer
✅ Profile found for user: test1@example.com
📄 Profile ID: 67a9b8c7d6e5f4321098765
🏢 Company Name: ABC Manufacturing Ltd
```

**Profile Save**:

```
💾 Saving profile for User ID: 67a1b2c3d4e5f6789012345
👤 User Email: test1@example.com
✅ Company Profile Updated Successfully for: test1@example.com
🏢 Updated Company Name: ABC Manufacturing Ltd
```

---

## 🔍 Advanced Debugging

If the issue persists, run these checks:

### 1. Verify JWT Contains Correct User ID

**Browser Console**:

```javascript
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const token = userInfo.token;

// Decode JWT (base64)
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Token User ID:", payload.id);
console.log("localStorage User ID:", userInfo._id);
console.log("Match?", payload.id === userInfo._id);
```

**Expected**: `Match? true`

### 2. Intercept API Call

**Browser Console** (before clicking Profile tab):

```javascript
const original = window.fetch;
window.fetch = function (...args) {
  console.log("Fetch:", args[0], "Headers:", args[1]?.headers);
  return original.apply(this, args);
};
```

**Expected**: Should show `Authorization: Bearer <token>` header

### 3. Check MongoDB Directly

**MongoDB Compass**:

- Connect to your cluster
- Database: `requirementcluster`
- Collections: `users` and `companyprofiles`

**Query Users**:

```javascript
db.users.find({}, { email: 1, role: 1 });
```

**Query Profiles**:

```javascript
db.companyprofiles.find({}, { user: 1, companyName: 1 });
```

**Verify**: Each profile's `user` field should match a DIFFERENT user's `_id`

---

## ✅ Final Verification Checklist

- [ ] Server logs show emoji symbols (🔐, ✅, 🔍) - confirms new code is running
- [ ] Each user login shows different User ID in server logs
- [ ] User 1 sees only their company name (ABC Manufacturing Ltd)
- [ ] User 2 sees only their company name (XYZ Industries Corp)
- [ ] Browser console shows "✅ Profile verified" for correct user
- [ ] No "❌ SECURITY ALERT" messages in browser console
- [ ] MongoDB shows 2 profiles with different `user` ObjectIds

**If all checkboxes are ✅, the security fix is working correctly! 🎉**
