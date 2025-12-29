import { create } from 'zustand';
import { Board, Task, Note, ColumnType, Priority, User, Subtask, ChecklistItem } from './types';

interface AppState {
  user: User | null;
  boards: Board[];
  tasks: Task[];
  notes: Note[];
  subtasks: Record<string, Subtask[]>;
  isLoading: boolean;
  
  // Auth actions
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Fetch actions
  fetchBoards: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  fetchSubtasks: (taskId: string) => Promise<void>;
  
  // Board actions
  addBoard: (name: string, description: string) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  updateBoard: (id: string, name: string, description: string) => Promise<void>;
  
  // Task actions
  addTask: (boardId: string, title: string, description: string, priority: Priority, checklist?: ChecklistItem[]) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  moveTask: (id: string, column: ColumnType) => Promise<void>;
  
  // Subtask actions
  addSubtask: (taskId: string, title: string) => Promise<void>;
  updateSubtask: (id: string, title?: string, completed?: boolean) => Promise<void>;
  deleteSubtask: (id: string, taskId: string) => Promise<void>;
  
  // Note actions
  addNote: (title: string, content: string, checklist?: ChecklistItem[]) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string, checklist?: ChecklistItem[]) => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  user: null,
  boards: [],
  tasks: [],
  notes: [],
  subtasks: {},
  isLoading: false,
  
  setUser: (user) => set({ user }),
  
  fetchUser: async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      set({ user: data.user });
    } catch (error) {
      set({ user: null });
    }
  },
  
  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
    const data = await res.json();
    set({ user: data.user });
  },
  
  register: async (email, password, name) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Registration failed');
    }
    const data = await res.json();
    set({ user: data.user });
  },
  
  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null, boards: [], tasks: [], notes: [], subtasks: {} });
  },
  
  fetchBoards: async () => {
    const res = await fetch('/api/boards');
    const boards = await res.json();
    set({ boards });
  },
  
  fetchTasks: async () => {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    set({ tasks });
  },
  
  fetchNotes: async () => {
    const res = await fetch('/api/notes');
    const notes = await res.json();
    set({ notes });
  },
  
  fetchSubtasks: async (taskId) => {
    const res = await fetch(`/api/subtasks?taskId=${taskId}`);
    const subtasks = await res.json();
    set((state) => ({
      subtasks: { ...state.subtasks, [taskId]: subtasks }
    }));
  },
  
  addBoard: async (name, description) => {
    const res = await fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    const board = await res.json();
    set((state) => ({ boards: [board, ...state.boards] }));
  },
  
  deleteBoard: async (id) => {
    await fetch(`/api/boards?id=${id}`, { method: 'DELETE' });
    set((state) => ({
      boards: state.boards.filter(b => b.id !== id),
      tasks: state.tasks.filter(t => t.boardId !== id),
    }));
  },
  
  updateBoard: async (id, name, description) => {
    const res = await fetch('/api/boards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, description }),
    });
    const board = await res.json();
    set((state) => ({
      boards: state.boards.map(b => b.id === id ? board : b),
    }));
  },
  
  addTask: async (boardId, title, description, priority, checklist = []) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId, title, description, priority, checklist }),
    });
    const task = await res.json();
    set((state) => ({ tasks: [task, ...state.tasks] }));
  },
  
  deleteTask: async (id) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    set((state) => ({ 
      tasks: state.tasks.filter(t => t.id !== id),
      subtasks: { ...state.subtasks, [id]: [] }
    }));
  },
  
  updateTask: async (id, updates) => {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    const task = await res.json();
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? task : t),
    }));
  },
  
  moveTask: async (id, column) => {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, column }),
    });
    const task = await res.json();
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? task : t),
    }));
  },
  
  addSubtask: async (taskId, title) => {
    const res = await fetch('/api/subtasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, title }),
    });
    const subtask = await res.json();
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: [...(state.subtasks[taskId] || []), subtask]
      }
    }));
  },
  
  updateSubtask: async (id, title, completed) => {
    const res = await fetch('/api/subtasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, completed }),
    });
    const updated = await res.json();
    set((state) => ({
      subtasks: Object.fromEntries(
        Object.entries(state.subtasks).map(([taskId, subs]) => [
          taskId,
          subs.map(s => s.id === id ? updated : s)
        ])
      )
    }));
  },
  
  deleteSubtask: async (id, taskId) => {
    await fetch(`/api/subtasks?id=${id}`, { method: 'DELETE' });
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: state.subtasks[taskId]?.filter(s => s.id !== id) || []
      }
    }));
  },
  
  addNote: async (title, content, checklist = []) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, checklist }),
    });
    const note = await res.json();
    set((state) => ({ notes: [note, ...state.notes] }));
  },
  
  deleteNote: async (id) => {
    await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
    set((state) => ({ notes: state.notes.filter(n => n.id !== id) }));
  },
  
  updateNote: async (id, title, content, checklist) => {
    const res = await fetch('/api/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, content, checklist }),
    });
    const note = await res.json();
    set((state) => ({
      notes: state.notes.map(n => n.id === id ? note : n),
    }));
  },
}));
