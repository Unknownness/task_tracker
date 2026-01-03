'use client';

import { useRef } from 'react'
import { useDrop } from 'react-dnd';
import { Task, ColumnType } from '@/lib/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  columnId: ColumnType;
  tasks: Task[];
  onDrop: (taskId: string, column: ColumnType) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const columnColors = {
  todo: 'bg-slate-50 border-slate-200',
  inProgress: 'bg-blue-50 border-blue-200',
  done: 'bg-green-50 border-green-200',
};

export default function KanbanColumn({ 
  title, 
  columnId, 
  tasks, 
  onDrop, 
  onDeleteTask,
  onEditTask 
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => onDrop(item.id, columnId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null); 
  drop(ref);

  return (
    <div className="flex-1 min-w-[300px]">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className={`px-4 py-3 border-b ${columnColors[columnId]}`}>
          <h3 className="font-semibold text-gray-800 flex items-center justify-between">
            {title}
            <span className="text-sm bg-white px-2 py-1 rounded-full">{tasks.length}</span>
          </h3>
        </div>
        
        <div
          ref={ref}
          className={`p-4 min-h-[500px] ${isOver ? 'bg-blue-50' : 'bg-gray-50'} transition-colors`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs mt-1">Drag tasks here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
