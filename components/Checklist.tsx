'use client';

import { useState } from 'react';
import { ChecklistItem } from '@/lib/types';
import { Plus, X, Check } from 'lucide-react';

interface ChecklistProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  editable?: boolean;
}

export default function Checklist({ items, onChange, editable = true }: ChecklistProps) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, { id: crypto.randomUUID(), text: newItem, completed: false }]);
      setNewItem('');
    }
  };

  const toggleItem = (id: string) => {
    onChange(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 group">
          <button
            type="button"
            onClick={() => toggleItem(item.id)}
            className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              item.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {item.completed && <Check size={14} className="text-white" />}
          </button>
          <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {item.text}
          </span>
          {editable && (
            <button
              title='Remove'
              type="button"
              onClick={() => removeItem(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
            >
              <X size={14} className="text-red-600" />
            </button>
          )}
        </div>
      ))}
      
      {editable && (
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add checklist item..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            title='Add'
            type="button"
            onClick={addItem}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
