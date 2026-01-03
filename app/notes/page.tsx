'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Note, ChecklistItem } from '@/lib/types';
import NoteCard from '@/components/NoteCard';
import Modal from '@/components/Modal';
import AuthGuard from '@/components/AuthGuard';
import Checklist from '@/components/Checklist';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Plus, Search, FileText } from 'lucide-react';

export default function NotesPage() {
  return (
    <AuthGuard>
      <NotesContent />
    </AuthGuard>
  );
}

function NotesContent() {
  const { notes, addNote, deleteNote, updateNote, fetchNotes } = useStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'withChecklist'>('all');

  useEffect(() => {
    setMounted(true);
    fetchNotes();
  }, [fetchNotes]);

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    checklist: [] as ChecklistItem[],
  });

  if (!mounted) return null;

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeTab === 'all' || 
      (activeTab === 'withChecklist' && note.checklist?.length > 0);
    
    return matchesSearch && matchesFilter;
  });

  const notesWithChecklist = notes.filter(note => note.checklist?.length > 0);
  const totalChecklistItems = notesWithChecklist.reduce((sum, note) => 
    sum + note.checklist.length, 0
  );
  const completedChecklistItems = notesWithChecklist.reduce((sum, note) => 
    sum + note.checklist.filter(item => item.completed).length, 0
  );

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteForm.title.trim()) {
      addNote(noteForm.title, noteForm.content, noteForm.checklist);
      setNoteForm({ title: '', content: '', checklist: [] });
      setIsCreateOpen(false);
    }
  };

  const handleEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote && noteForm.title.trim()) {
      updateNote(editingNote.id, noteForm.title, noteForm.content, noteForm.checklist);
      setNoteForm({ title: '', content: '', checklist: [] });
      setIsEditOpen(false);
      setEditingNote(null);
    }
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      checklist: note.checklist || [],
    });
    setIsEditOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
      deleteNote(id);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Заметки</h1>
            <p className="text-gray-600 mt-2">
              Всего заметок: {notes.length} • Чеклистов: {notesWithChecklist.length} ({completedChecklistItems}/{totalChecklistItems} выполнено)
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={20} />
            <span>Новая заметка</span>
          </button>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Все заметки
            </button>
            <button
              onClick={() => setActiveTab('withChecklist')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'withChecklist'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              С чеклистом
            </button>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск заметок..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Заметок пока нет</h2>
            <p className="text-gray-500 mb-6">Создайте свою первую заметку</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
            >
              Создать заметку
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Не найдено заметок по вашему запросу</p>
            <p className="text-gray-400 mt-2">Попробуйте изменить поисковый запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={openEditNote}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Создать новую заметку"
        className="max-w-4xl"
        size='xl'
      >
        <form onSubmit={handleCreateNote}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок *
            </label>
            <input
              type="text"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Название заметки"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Содержимое
            </label>
            <MarkdownEditor
              value={noteForm.content}
              onChange={(content) => setNoteForm({ ...noteForm, content })}
              placeholder="Начните писать заметку..."
              className="min-h-[300px]"
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Чеклист (опционально)
            </label>
            <Checklist 
              items={noteForm.checklist} 
              onChange={(items) => setNoteForm({ ...noteForm, checklist: items })}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
            >
              Создать заметку
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingNote(null);
        }}
        title="Редактировать заметку"
        className="max-w-4xl"
        size='xl'
      >
        <form onSubmit={handleEditNote}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок *
            </label>
            <input
              title='Title'
              type="text"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Содержимое
            </label>
            <MarkdownEditor
              value={noteForm.content}
              onChange={(content) => setNoteForm({ ...noteForm, content })}
              className="min-h-[300px]"
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Чеклист
            </label>
            <Checklist 
              items={noteForm.checklist} 
              onChange={(items) => setNoteForm({ ...noteForm, checklist: items })}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditOpen(false);
                setEditingNote(null);
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}