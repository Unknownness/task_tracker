export type Priority = 'low' | 'medium' | 'high';
export type ColumnType = 'todo' | 'inProgress' | 'done';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  column: ColumnType;
  boardId: string;
  userId: string;
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
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}
