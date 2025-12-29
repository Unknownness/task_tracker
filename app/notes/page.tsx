'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Note } from '@/lib/types';
import NoteCard from '@/components/NoteCard';
import Modal from '@/components/Modal';
import { Plus, Search } from 'lucide-react';

export default function NotesPage() {
  const { notes, addNote, deleteNote, updateNote, fetchNotes } = useStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchNotes();
  }, [fetchNotes]);

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
  });

  if (!mounted) return null;

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteForm.title.trim()) {
      addNote(noteForm.title, noteForm.content);
      setNoteForm({ title: '', content: '' });
      setIsCreateOpen(false);
    }
  };

  const handleEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote && noteForm.title.trim()) {
      updateNote(editingNote.id, noteForm.title, noteForm.content);
      setNoteForm({ title: '', content: '' });
      setIsEditOpen(false);
      setEditingNote(null);
    }
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
    });
    setIsEditOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Note</span>
          </button>
        </div>

        {notes.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No notes yet</h2>
            <p className="text-gray-500 mb-6">Create your first note to capture ideas</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No notes match your search</p>
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
        title="Create New Note"
      >
        <form onSubmit={handleCreateNote}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Note title"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={8}
              placeholder="Write your note here..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Note
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingNote(null);
        }}
        title="Edit Note"
      >
        <form onSubmit={handleEditNote}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              title='Title'
              type="text"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              title='Content'
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={8}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Update Note
          </button>
        </form>
      </Modal>
    </div>
  );
}
