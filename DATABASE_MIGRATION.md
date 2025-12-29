# Database Integration - Migration Guide

## What Changed

The application has been migrated from localStorage to SQLite + Prisma for data persistence.

### Key Changes:

1. **Added Dependencies**
   - `@prisma/client`: ^6.2.0
   - `prisma`: ^6.2.0 (dev dependency)

2. **New Files Created**
   - `/prisma/schema.prisma` - Database schema definition
   - `/lib/prisma.ts` - Prisma client singleton
   - `/app/api/boards/route.ts` - Board API endpoints
   - `/app/api/tasks/route.ts` - Task API endpoints
   - `/app/api/notes/route.ts` - Note API endpoints

3. **Modified Files**
   - `package.json` - Added Prisma dependencies and scripts
   - `lib/store.ts` - Replaced localStorage with API calls
   - `app/boards/page.tsx` - Added data fetching on mount
   - `app/notes/page.tsx` - Added data fetching on mount
   - `.gitignore` - Added database files
   - `README.md` - Updated with database setup instructions

## Setup Instructions

### First Time Setup

1. **Install dependencies** (includes Prisma):
   ```bash
   npm install
   ```

2. **Initialize database**:
   ```bash
   npm run db:push
   ```
   This creates the SQLite database file at `prisma/dev.db` and applies the schema.

3. **Start the application**:
   ```bash
   npm run dev
   ```

### Database Schema

The schema includes three models:

- **Board**: Stores board information (id, name, description, timestamps)
- **Task**: Stores tasks with relation to boards (id, title, description, priority, column, boardId, timestamps)
- **Note**: Stores standalone notes (id, title, content, timestamps)

### API Endpoints

All endpoints support standard REST operations:

**Boards** (`/api/boards`)
- GET: Fetch all boards
- POST: Create new board
- PUT: Update board
- DELETE: Delete board (cascades to tasks)

**Tasks** (`/api/tasks`)
- GET: Fetch all tasks
- POST: Create new task
- PUT: Update task (including moving between columns)
- DELETE: Delete task

**Notes** (`/api/notes`)
- GET: Fetch all notes
- POST: Create new note
- PUT: Update note
- DELETE: Delete note

### Useful Commands

```bash
# Push schema changes to database
npm run db:push

# Open Prisma Studio (visual database editor)
npm run db:studio

# Generate Prisma Client (auto-runs on install)
npx prisma generate
```

## Benefits of This Migration

1. **Persistent Storage**: Data survives browser cache clears
2. **Better Performance**: Server-side data management
3. **Scalability**: Easy to migrate to PostgreSQL/MySQL later
4. **Data Integrity**: Database constraints and relations
5. **Developer Tools**: Prisma Studio for database inspection
6. **Type Safety**: Auto-generated TypeScript types from schema

## Migration Notes

- All existing localStorage data will NOT be automatically migrated
- Users will start with a fresh database
- The database file (`prisma/dev.db`) is gitignored by default
- For production, consider using a hosted database (PostgreSQL, MySQL, etc.)

## Troubleshooting

**Issue**: "Cannot find module '@prisma/client'"
**Solution**: Run `npm install` and `npx prisma generate`

**Issue**: Database errors on startup
**Solution**: Delete `prisma/dev.db` and run `npm run db:push` again

**Issue**: Changes not persisting
**Solution**: Check browser console for API errors, ensure dev server is running
