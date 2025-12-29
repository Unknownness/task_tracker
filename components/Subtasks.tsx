'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Subtask } from '@/lib/types';
import { Plus, X, Check } from 'lucide-react';

interface SubtasksProps {
  taskId: string;
}

export default function Subtasks({ taskId }: SubtasksProps) {
  const { subtasks, fetchSubtasks, addSubtask, updateSubtask, deleteSubtask } = useStore();
  const [newSubtask, setNewSubtask] = useState('');
  const taskSubtasks = subtasks[taskId] || [];

  useEffect(() => {
    fetchSubtasks(taskId);
  }, [taskId, fetchSubtasks]);

  const handleAdd = async () => {
    if (newSubtask.trim()) {
      await addSubtask(taskId, newSubtask);
      setNewSubtask('');
    }
  };

  const handleToggle = async (subtask: Subtask) => {
    await updateSubtask(subtask.id, undefined, !subtask.completed);
  };

  const handleDelete = async (id: string) => {
    await deleteSubtask(id, taskId);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Subtasks</h4>
      
      {taskSubtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-2 group">
          <button
            type="button"
            onClick={() => handleToggle(subtask)}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              subtask.completed
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {subtask.completed && <Check size={14} className="text-white" />}
          </button>
          <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {subtask.title}
          </span>
          <button
            type="button"
            onClick={() => handleDelete(subtask.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
          >
            <X size={14} className="text-red-600" />
          </button>
        </div>
      ))}
      
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add subtask..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
