export type Priority = 'low' | 'medium' | 'high';
export type ColumnType = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  column: ColumnType;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}
