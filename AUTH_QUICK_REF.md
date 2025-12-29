# Authentication Quick Reference

## 🚀 Quick Start

```bash
# 1. Install new dependencies
npm install

# 2. Update database (⚠️ will reset data)
npm run db:push

# 3. Start server
npm run dev

# 4. Register at http://localhost:3000/register
```

## 🔐 Features Implemented

✅ User Registration with password hashing
✅ User Login with JWT tokens
✅ Session management (HTTP-only cookies)
✅ Logout functionality
✅ Protected routes (boards, notes)
✅ User-specific data isolation
✅ Unauthorized page for non-authenticated users
✅ Navigation with user info and logout button
✅ Auto-redirect authenticated users from home page

## 📋 User Flow

### New User
1. Visit site → Home page
2. Click "Sign Up" → Registration page
3. Enter name, email, password
4. Auto-login → Redirected to Boards
5. Create boards, tasks, notes (user-specific)

### Returning User
1. Visit site → Home page
2. Click "Sign In" → Login page
3. Enter email, password
4. Redirected to Boards
5. See only their own data

### Unauthorized Access
1. Visit /boards without login
2. AuthGuard checks session
3. No session → Redirect to /unauthorized
4. Click "Sign In" or "Sign Up"

## 🔒 Security

- **Passwords**: Hashed with bcryptjs (10 salt rounds)
- **Sessions**: JWT tokens in HTTP-only cookies
- **Token Expiry**: 7 days
- **Data Isolation**: All queries filtered by userId
- **Protected APIs**: All CRUD routes require authentication

## 📁 Key Files

### Auth System
- `lib/auth.ts` - JWT utilities
- `app/api/auth/*` - Auth endpoints
- `components/AuthGuard.tsx` - Route protection
- `components/Navigation.tsx` - User UI

### Pages
- `/login` - Login form
- `/register` - Registration form
- `/unauthorized` - Access denied
- `/boards` - Protected (requires auth)
- `/notes` - Protected (requires auth)

### Database
- `prisma/schema.prisma` - User model + relations

## 🎯 API Endpoints

### Public
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Protected (require auth)
- `POST /api/auth/logout` - Sign out
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create board
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create note

## ⚙️ Environment Variables

Optional (has default for dev):
```env
JWT_SECRET=your-secret-key-here
```

## 🧪 Test Scenarios

1. **Register** → Should create account and login
2. **Login** → Should authenticate and redirect
3. **Access /boards without auth** → Should redirect to /unauthorized
4. **Create board** → Should be user-specific
5. **Logout** → Should clear session
6. **Register 2nd user** → Should not see 1st user's data

## 🚨 Important Notes

- Running `npm run db:push` will **reset all data**
- Each user sees only their own boards/tasks/notes
- Sessions expire after 7 days
- Logout clears session immediately
- Protected pages show loading spinner while checking auth

## 📊 Database Schema

```
User
├── id (UUID)
├── email (unique)
├── password (hashed)
├── name
└── Relations:
    ├── boards[]
    ├── tasks[]
    └── notes[]

Board/Task/Note
├── userId (FK → User.id)
└── CASCADE DELETE on user deletion
```

## 🎨 UI Components

- **Navigation**: Shows user name + logout when authenticated
- **AuthGuard**: Wraps protected pages, shows loading spinner
- **Login/Register**: Beautiful gradient forms
- **Unauthorized**: Clear message with sign in/up options

---

**Ready to use!** Register your first user and start creating boards.
