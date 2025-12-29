'use client';

import { Note } from '@/lib/types';
import { Trash2, Edit, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-800 flex-1">{note.title}</h3>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(note)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 whitespace-pre-wrap mb-4">{note.content}</p>
      
      <div className="flex items-center text-xs text-gray-500">
        <Clock size={12} className="mr-1" />
        Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}
      </div>
    </div>
  );
}
