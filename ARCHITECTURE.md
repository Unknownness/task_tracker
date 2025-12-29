# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Boards Page  │  │  Notes Page  │  │  Home Page   │      │
│  │  (React)     │  │   (React)    │  │   (React)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                  │                                  │
│         └──────────┬───────┘                                 │
│                    │                                          │
│         ┌──────────▼──────────┐                              │
│         │   Zustand Store     │                              │
│         │  (State Management) │                              │
│         └──────────┬──────────┘                              │
│                    │                                          │
└────────────────────┼──────────────────────────────────────────┘
                     │
                     │ Fetch API Calls
                     │
┌────────────────────▼──────────────────────────────────────────┐
│                        API LAYER                              │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ /api/boards │  │ /api/tasks  │  │ /api/notes  │         │
│  │   (REST)    │  │   (REST)    │  │   (REST)    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                 │
│         └─────────────────┼─────────────────┘                │
│                           │                                   │
│                ┌──────────▼──────────┐                       │
│                │   Prisma Client     │                       │
│                │  (ORM / Type-Safe)  │                       │
│                └──────────┬──────────┘                       │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                      DATABASE LAYER                           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                    ┌──────────────┐                          │
│                    │    SQLite    │                          │
│                    │  (dev.db)    │                          │
│                    └──────────────┘                          │
│                                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Board   │    │   Task   │    │   Note   │              │
│  │  Table   │───▶│  Table   │    │  Table   │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                   (Foreign Key)                              │
│                   (Cascade Delete)                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Task

```
1. User clicks "Add Task" button
   ↓
2. Modal form opens (React Component)
   ↓
3. User fills form and submits
   ↓
4. Component calls: addTask(boardId, title, description, priority)
   ↓
5. Zustand store action executes
   ↓
6. Fetch POST request to /api/tasks
   ↓
7. API route receives request
   ↓
8. Prisma creates task in database
   ↓
9. Database returns created task
   ↓
10. API route returns JSON response
   ↓
11. Zustand updates local state
   ↓
12. React re-renders with new task
   ↓
13. User sees task in "To Do" column
```

### Dragging a Task

```
1. User drags task card
   ↓
2. React DnD tracks drag
   ↓
3. User drops in new column
   ↓
4. Component calls: moveTask(taskId, newColumn)
   ↓
5. Zustand store action executes
   ↓
6. Fetch PUT request to /api/tasks
   ↓
7. Prisma updates task.column
   ↓
8. Database returns updated task
   ↓
9. Zustand updates local state
   ↓
10. React re-renders task in new column
```

## Database Schema

```
┌─────────────────────┐
│       Board         │
├─────────────────────┤
│ id (UUID) PK        │
│ name (String)       │
│ description (String)│
│ createdAt (DateTime)│
│ updatedAt (DateTime)│
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│        Task         │
├─────────────────────┤
│ id (UUID) PK        │
│ title (String)      │
│ description (String)│
│ priority (String)   │
│ column (String)     │
│ boardId (UUID) FK   │◀── Cascade Delete
│ createdAt (DateTime)│
│ updatedAt (DateTime)│
└─────────────────────┘

┌─────────────────────┐
│        Note         │
├─────────────────────┤
│ id (UUID) PK        │
│ title (String)      │
│ content (String)    │
│ createdAt (DateTime)│
│ updatedAt (DateTime)│
└─────────────────────┘
```

## API Endpoints

### Boards API (`/api/boards`)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/boards` | - | Array of boards |
| POST | `/api/boards` | `{name, description}` | Created board |
| PUT | `/api/boards` | `{id, name, description}` | Updated board |
| DELETE | `/api/boards?id={id}` | - | `{success: true}` |

### Tasks API (`/api/tasks`)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/tasks` | - | Array of tasks |
| POST | `/api/tasks` | `{boardId, title, description, priority}` | Created task |
| PUT | `/api/tasks` | `{id, ...updates}` | Updated task |
| DELETE | `/api/tasks?id={id}` | - | `{success: true}` |

### Notes API (`/api/notes`)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/notes` | - | Array of notes |
| POST | `/api/notes` | `{title, content}` | Created note |
| PUT | `/api/notes` | `{id, title, content}` | Updated note |
| DELETE | `/api/notes?id={id}` | - | `{success: true}` |

## Technology Stack

```
┌─────────────────────────────────────┐
│         Next.js 16.1.0              │
│  (React 19, App Router, API Routes) │
└─────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐        ┌─────▼─────┐
│Frontend│        │  Backend  │
└───┬────┘        └─────┬─────┘
    │                   │
┌───▼────────────┐  ┌───▼──────────┐
│ React 19       │  │ Prisma 6.2.0 │
│ Zustand 4.5.2  │  │ SQLite       │
│ React DnD 16   │  │              │
│ Tailwind 4.1   │  │              │
│ Lucide Icons   │  │              │
└────────────────┘  └──────────────┘
```

## File Structure

```
TestApp/
│
├── app/                    # Next.js App Router
│   ├── api/               # Backend API Routes
│   │   ├── boards/
│   │   │   └── route.ts   # Board CRUD
│   │   ├── tasks/
│   │   │   └── route.ts   # Task CRUD
│   │   └── notes/
│   │       └── route.ts   # Note CRUD
│   │
│   ├── boards/            # Boards Page
│   │   └── page.tsx
│   ├── notes/             # Notes Page
│   │   └── page.tsx
│   │
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Home Page
│   └── globals.css        # Global Styles
│
├── components/            # React Components
│   ├── KanbanColumn.tsx
│   ├── TaskCard.tsx
│   ├── NoteCard.tsx
│   └── Modal.tsx
│
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma Client
│   ├── store.ts          # Zustand Store
│   └── types.ts          # TypeScript Types
│
├── prisma/               # Database
│   ├── schema.prisma     # Schema Definition
│   └── dev.db           # SQLite Database
│
└── [config files]        # Various configs
```

## State Management Flow

```
┌──────────────────────────────────────────┐
│          Zustand Store                   │
├──────────────────────────────────────────┤
│                                          │
│  State:                                  │
│  ├── boards: Board[]                     │
│  ├── tasks: Task[]                       │
│  └── notes: Note[]                       │
│                                          │
│  Actions (async):                        │
│  ├── fetchBoards()                       │
│  ├── addBoard()                          │
│  ├── updateBoard()                       │
│  ├── deleteBoard()                       │
│  ├── fetchTasks()                        │
│  ├── addTask()                           │
│  ├── updateTask()                        │
│  ├── moveTask()                          │
│  ├── deleteTask()                        │
│  ├── fetchNotes()                        │
│  ├── addNote()                           │
│  ├── updateNote()                        │
│  └── deleteNote()                        │
│                                          │
└──────────────────────────────────────────┘
         │                    ▲
         │ API Calls          │ Updates
         ▼                    │
    ┌────────────────────────┴───┐
    │      API Routes            │
    │  (Server-side handlers)    │
    └────────────────────────────┘
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety throughout
- ✅ Scalable structure
- ✅ Easy to test
- ✅ Production-ready
