'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useStore } from '@/lib/store';
import { Task, Priority, ColumnType, ChecklistItem } from '@/lib/types';
import KanbanColumn from '@/components/KanbanColumn';
import Modal from '@/components/Modal';
import AuthGuard from '@/components/AuthGuard';
import Checklist from '@/components/Checklist';
import { Plus, Trash2 } from 'lucide-react';

export default function BoardsPage() {
  return (
    <AuthGuard>
      <BoardsContent />
    </AuthGuard>
  );
}

function BoardsContent() {
  const { boards, tasks, addBoard, deleteBoard, addTask, deleteTask, updateTask, moveTask, fetchBoards, fetchTasks } = useStore();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBoards();
    fetchTasks();
  }, [fetchBoards, fetchTasks]);

  useEffect(() => {
    if (mounted && boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id);
    }
  }, [mounted, boards, selectedBoardId]);

  const [boardForm, setBoardForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    checklist: [] as ChecklistItem[],
    parentTaskId: null as string | null,
  });

  if (!mounted) return null;

  const selectedBoard = boards.find(b => b.id === selectedBoardId);
  const boardTasks = tasks.filter(t => t.boardId === selectedBoardId && !t.parentTaskId);

  const columns: { id: ColumnType; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'inProgress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardForm.name.trim()) {
      addBoard(boardForm.name, boardForm.description);
      setBoardForm({ name: '', description: '' });
      setIsCreateBoardOpen(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskForm.title.trim() && selectedBoardId) {
      addTask(selectedBoardId, taskForm.title, taskForm.description, taskForm.priority, taskForm.checklist, taskForm.parentTaskId || undefined);
      setTaskForm({ title: '', description: '', priority: 'medium', checklist: [], parentTaskId: null });
      setIsCreateTaskOpen(false);
    }
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask && taskForm.title.trim()) {
      updateTask(editingTask.id, {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        checklist: taskForm.checklist,
      });
      setTaskForm({ title: '', description: '', priority: 'medium', checklist: [], parentTaskId: null });
      setIsEditTaskOpen(false);
      setEditingTask(null);
    }
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      checklist: task.checklist || [],
      parentTaskId: task.parentTaskId || null,
    });
    setIsEditTaskOpen(true);
  };

  const openCreateSubtask = (parentTask: Task) => {
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      checklist: [],
      parentTaskId: parentTask.id,
    });
    setIsCreateTaskOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Kanban Boards</h1>
            <button
              onClick={() => setIsCreateBoardOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>New Board</span>
            </button>
          </div>

          {boards.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No boards yet</h2>
              <p className="text-gray-500 mb-6">Create your first board to get started</p>
              <button
                onClick={() => setIsCreateBoardOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Board
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center space-x-4 overflow-x-auto pb-2">
                {boards.map((board) => (
                  <div key={board.id} className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedBoardId(board.id)}
                      className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        selectedBoardId === board.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {board.name}
                    </button>
                    {selectedBoardId === board.id && (
                      <button
                        title='Delete'
                        onClick={() => {
                          if (confirm('Delete this board and all its tasks?')) {
                            deleteBoard(board.id);
                            setSelectedBoardId(null);
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {selectedBoard && (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedBoard.name}</h2>
                        {selectedBoard.description && (
                          <p className="text-gray-600">{selectedBoard.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setIsCreateTaskOpen(true)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus size={20} />
                        <span>Add Task</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-6 overflow-x-auto pb-4">
                    {columns.map((column) => (
                      <KanbanColumn
                        key={column.id}
                        title={column.title}
                        columnId={column.id}
                        tasks={boardTasks.filter(t => t.column === column.id)}
                        onDrop={moveTask}
                        onDeleteTask={deleteTask}
                        onEditTask={openEditTask}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        title="Create New Board"
      >
        <form onSubmit={handleCreateBoard}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board Name *
            </label>
            <input
              type="text"
              value={boardForm.name}
              onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Project Alpha"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={boardForm.description}
              onChange={(e) => setBoardForm({ ...boardForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What is this board for?"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Board
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false);
          setTaskForm({ title: '', description: '', priority: 'medium', checklist: [], parentTaskId: null });
        }}
        title={taskForm.parentTaskId ? "Create Subtask" : "Create New Task"}
      >
        <form onSubmit={handleCreateTask}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Design homepage"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Task details..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              title='Priority'
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Checklist (optional)
            </label>
            <Checklist 
              items={taskForm.checklist} 
              onChange={(items) => setTaskForm({ ...taskForm, checklist: items })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {taskForm.parentTaskId ? 'Create Subtask' : 'Create Task'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isEditTaskOpen}
        onClose={() => {
          setIsEditTaskOpen(false);
          setEditingTask(null);
        }}
        title="Edit Task"
      >
        <form onSubmit={handleEditTask}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              title='Title'
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              title='Description'
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              title='Priority'
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Checklist
            </label>
            <Checklist 
              items={taskForm.checklist} 
              onChange={(items) => setTaskForm({ ...taskForm, checklist: items })}
            />
          </div>
          {editingTask && !editingTask.parentTaskId && (
            <div className="mb-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsEditTaskOpen(false);
                  openCreateSubtask(editingTask);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus size={16} />
                Add Subtask
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Task
          </button>
        </form>
      </Modal>
    </DndProvider>
  );
}
