'use client';

import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Task } from '@/lib/types';
import { Trash2, Edit, Clock, CheckSquare, ListTodo, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '@/lib/store';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isSubtask?: boolean;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

export default function TaskCard({ task, onDelete, onEdit, isSubtask = false }: TaskCardProps) {
  const { updateTask } = useStore();
  const [expandedSubtasks, setExpandedSubtasks] = useState(false);
  const [expandedChecklist, setExpandedChecklist] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id]);

  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(s => s.column === 'done').length || 0;
  const checklistCount = task.checklist?.length || 0;
  const completedChecklist = task.checklist?.filter(c => c.completed).length || 0;

  const toggleChecklistItem = async (itemId: string) => {
    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    await updateTask(task.id, { checklist: updatedChecklist });
  };

  return (
    <div className={isSubtask ? '' : 'mb-3'}>
      <div
        ref={isSubtask ? null : drag}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
          isSubtask ? '' : 'cursor-move hover:shadow-md'
        } transition-shadow ${
          isDragging ? 'opacity-50' : 'opacity-100'
        } ${isSubtask ? 'ml-6 mb-2' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className={`font-semibold text-gray-800 flex-1 ${isSubtask ? 'text-sm' : ''}`}>
            {task.title}
          </h4>
          <div className="flex gap-1 ml-2">
            <button
              title='Edit'
              onClick={() => onEdit(task)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Edit size={isSubtask ? 14 : 16} className="text-gray-600" />
            </button>
            <button
              title='Delete'
              onClick={() => onDelete(task.id)}
              className="p-1 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={isSubtask ? 14 : 16} className="text-red-600" />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className={`text-gray-600 mb-3 ${isSubtask ? 'text-xs' : 'text-sm'}`}>
            {task.description}
          </p>
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
              <button
                onClick={() => setExpandedSubtasks(!expandedSubtasks)}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                {expandedSubtasks ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <ListTodo size={14} />
                <span>{completedSubtasks}/{subtaskCount}</span>
              </button>
            )}
            {checklistCount > 0 && (
              <button
                onClick={() => setExpandedChecklist(!expandedChecklist)}
                className="flex items-center gap-1 hover:text-green-600 transition-colors"
              >
                {expandedChecklist ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <CheckSquare size={14} />
                <span>{completedChecklist}/{checklistCount}</span>
              </button>
            )}
          </div>
        )}

        {expandedChecklist && checklistCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            {task.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <button
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    item.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {item.completed && <Check size={12} className="text-white" />}
                </button>
                <span className={`text-xs ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {expandedSubtasks && subtaskCount > 0 && (
        <div className="mt-2">
          {task.subtasks?.map((subtask) => (
            <TaskCard
              key={subtask.id}
              task={subtask}
              onDelete={onDelete}
              onEdit={onEdit}
              isSubtask={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
