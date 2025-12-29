import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Task, Note, ColumnType, Priority } from './types';

interface AppState {
  boards: Board[];
  tasks: Task[];
  notes: Note[];
  
  // Board actions
  addBoard: (name: string, description: string) => void;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, name: string, description: string) => void;
  
  // Task actions
  addTask: (boardId: string, title: string, description: string, priority: Priority) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, column: ColumnType) => void;
  
  // Note actions
  addNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      boards: [],
      tasks: [],
      notes: [],
      
      addBoard: (name, description) => set((state) => ({
        boards: [...state.boards, {
          id: crypto.randomUUID(),
          name,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      })),
      
      deleteBoard: (id) => set((state) => ({
        boards: state.boards.filter(b => b.id !== id),
        tasks: state.tasks.filter(t => t.boardId !== id),
      })),
      
      updateBoard: (id, name, description) => set((state) => ({
        boards: state.boards.map(b => 
          b.id === id ? { ...b, name, description, updatedAt: new Date().toISOString() } : b
        ),
      })),
      
      addTask: (boardId, title, description, priority) => set((state) => ({
        tasks: [...state.tasks, {
          id: crypto.randomUUID(),
          title,
          description,
          priority,
          column: 'todo',
          boardId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id),
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        ),
      })),
      
      moveTask: (id, column) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, column, updatedAt: new Date().toISOString() } : t
        ),
      })),
      
      addNote: (title, content) => set((state) => ({
        notes: [...state.notes, {
          id: crypto.randomUUID(),
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      })),
      
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id),
      })),
      
      updateNote: (id, title, content) => set((state) => ({
        notes: state.notes.map(n => 
          n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
        ),
      })),
    }),
    {
      name: 'task-tracker-storage',
    }
  )
);
