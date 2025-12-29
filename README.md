# Task Tracker - Kanban & Notes

A modern, full-stack task tracking application built with Next.js 14, featuring Kanban boards with drag-and-drop functionality and a standalone notes system.

## Features

### Kanban Boards
- ✅ Create multiple boards for different projects
- ✅ Three-column layout (To Do, In Progress, Done)
- ✅ Drag-and-drop tasks between columns
- ✅ Task priorities (Low, Medium, High)
- ✅ Task descriptions and metadata
- ✅ Edit and delete tasks
- ✅ Delete boards with all associated tasks

### Notes
- ✅ Create standalone notes independent of boards
- ✅ Rich text content support
- ✅ Search functionality
- ✅ Edit and delete notes
- ✅ Timestamps for tracking

### Additional Features
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Local storage persistence (data saved automatically)
- ✅ Client-side state management with Zustand
- ✅ TypeScript for type safety
- ✅ Beautiful gradient designs and smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: React DnD
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /boards          # Kanban boards page
  /notes           # Notes page
  layout.tsx       # Root layout with navigation
  page.tsx         # Home page
  globals.css      # Global styles
/components
  KanbanColumn.tsx # Drag-drop column component
  TaskCard.tsx     # Individual task card
  NoteCard.tsx     # Individual note card
  Modal.tsx        # Reusable modal component
/lib
  types.ts         # TypeScript type definitions
  store.ts         # Zustand state management
```

## Usage

### Creating a Board
1. Navigate to "Boards" from the navigation
2. Click "New Board"
3. Enter board name and description
4. Click "Create Board"

### Managing Tasks
1. Select a board from the board tabs
2. Click "Add Task" to create a new task
3. Fill in task details (title, description, priority)
4. Drag tasks between columns to update their status
5. Click edit icon to modify task details
6. Click trash icon to delete a task

### Working with Notes
1. Navigate to "Notes" from the navigation
2. Click "New Note"
3. Enter note title and content
4. Use the search bar to find specific notes
5. Click edit icon to modify notes
6. Click trash icon to delete notes

## Data Persistence

All data is automatically saved to browser's localStorage. Your boards, tasks, and notes will persist across browser sessions.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT

## Author

Built with ❤️ using Next.js
