# Quick Start Guide

## 🚀 Getting Started (3 Steps)

### 1. Install Dependencies
```bash
npm install
```
This will install all packages including Prisma and automatically generate the Prisma Client.

### 2. Setup Database
```bash
npm run db:push
```
This creates the SQLite database and applies the schema.

### 3. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## 📦 What's Included

- **SQLite Database** - Local file-based database (no server needed)
- **Prisma ORM** - Type-safe database access
- **REST API** - Next.js API routes for all operations
- **Zustand Store** - Client-side state management
- **React DnD** - Drag-and-drop functionality

## 🛠️ Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Update database schema
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 📊 Database Structure

### Tables
- **Board** - Project boards
- **Task** - Tasks within boards (with cascade delete)
- **Note** - Standalone notes

### Location
- Database file: `prisma/dev.db`
- Schema: `prisma/schema.prisma`

## 🔄 How It Works

1. **Frontend** (React components) → 
2. **Zustand Store** (state management) → 
3. **API Routes** (`/app/api/*`) → 
4. **Prisma Client** → 
5. **SQLite Database**

## 🎯 Key Features

✅ Persistent data storage (survives browser restarts)
✅ Server-side data validation
✅ Type-safe database operations
✅ Automatic timestamps
✅ Cascade delete (deleting board removes all tasks)
✅ Visual database management with Prisma Studio

## 📝 Notes

- Database file is automatically created on first run
- All data is stored locally in `prisma/dev.db`
- No external database server required
- Easy to migrate to PostgreSQL/MySQL later if needed
