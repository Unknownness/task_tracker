'use client';

import { Note } from '@/lib/types';
import { Trash2, Edit, Clock, CheckSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  const checklistCount = note.checklist?.length || 0;
  const completedChecklist = note.checklist?.filter(c => c.completed).length || 0;
  const [expanded, setExpanded] = useState(false);
  const [expandedChecklist, setExpandedChecklist] = useState(false);

  const hasChecklist = checklistCount > 0;
  const isLongContent = note.content.length > 200;
  const displayContent = expanded || !isLongContent ? note.content : `${note.content.substring(0, 200)}...`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-800 flex-1 pr-2">{note.title}</h3>
        <div className="flex gap-1 ml-2 flex-shrink-0">
          <button
            title='Edit'
            onClick={() => onEdit(note)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit size={18} className="text-gray-600" />
          </button>
          <button
            title='Delete'
            onClick={() => onDelete(note.id)}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <MarkdownPreview 
          content={displayContent} 
          className="text-sm text-gray-700"
        />
      </div>
      
      {isLongContent && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
        >
          {expanded ? 'Свернуть' : 'Показать полностью'}
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      )}
      
      {hasChecklist && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <button
            onClick={() => setExpandedChecklist(!expandedChecklist)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 w-full"
          >
            {expandedChecklist ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <CheckSquare size={16} />
            <span>Чеклист ({completedChecklist}/{checklistCount})</span>
          </button>
          
          {expandedChecklist && (
            <div className="mt-3 pl-7 space-y-2">
              {note.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                    item.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center text-xs text-gray-500">
        <Clock size={12} className="mr-1 flex-shrink-0" />
        <span>Обновлено {format(new Date(note.updatedAt), 'dd.MM.yyyy HH:mm')}</span>
      </div>
    </div>
  );
}