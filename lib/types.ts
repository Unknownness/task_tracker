export type Priority = 'low' | 'medium' | 'high';
export type ColumnType = 'todo' | 'inProgress' | 'done';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  column: ColumnType;
  checklist: ChecklistItem[];
  boardId: string;
  userId: string;
  parentTaskId?: string | null;
  subtasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  checklist: ChecklistItem[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}
