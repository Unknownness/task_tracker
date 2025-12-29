'use client';

import { useDrag } from 'react-dnd';
import { Task } from '@/lib/types';
import { Trash2, Edit, Clock, CheckSquare, ListTodo } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const checklistCount = task.checklist?.length || 0;
  const completedChecklist = task.checklist?.filter(c => c.completed).length || 0;

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 flex-1">{task.title}</h4>
        <div className="flex gap-1 ml-2">
          <button
            title='Edit'
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit size={16} className="text-gray-600" />
          </button>
          <button
            title='Delete'
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          {format(new Date(task.updatedAt), 'MMM d')}
        </div>
      </div>

      {(subtaskCount > 0 || checklistCount > 0) && (
        <div className="flex gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
          {subtaskCount > 0 && (
            <div className="flex items-center gap-1">
              <ListTodo size={14} />
              <span>{completedSubtasks}/{subtaskCount}</span>
            </div>
          )}
          {checklistCount > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare size={14} />
              <span>{completedChecklist}/{checklistCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
