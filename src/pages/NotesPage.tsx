import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Note } from '../types/crm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  User,
  Edit2,
  Trash2,
  X,
  Tag,
  BookOpen
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { notes, contacts, deals, addNote, updateNote, deleteNote } = useCRM();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    relatedType: 'Contact' as 'Contact' | 'Deal' | 'Lead' | 'General',
    relatedId: contacts[0]?.id || '',
    relatedName: contacts[0] ? `${contacts[0].firstName} ${contacts[0].lastName}` : 'General',
    author: 'Parth Atrishi',
  });

  const filteredNotes = notes.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      (n.relatedName && n.relatedName.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === 'ALL' || n.relatedType === filterType;
    return matchSearch && matchType;
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      content: '',
      relatedType: 'Contact',
      relatedId: contacts[0]?.id || '',
      relatedName: contacts[0] ? `${contacts[0].firstName} ${contacts[0].lastName}` : 'General',
      author: 'Parth Atrishi',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (n: Note) => {
    setEditingNote(n);
    setFormData({
      title: n.title,
      content: n.content,
      relatedType: n.relatedType || 'General',
      relatedId: n.relatedId || '',
      relatedName: n.relatedName || 'General',
      author: n.author,
    });
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, {
        title: formData.title,
        content: formData.content,
        relatedType: formData.relatedType,
        relatedId: formData.relatedId,
        relatedName: formData.relatedName,
      });
      setEditingNote(null);
    } else {
      addNote({
        title: formData.title,
        content: formData.content,
        relatedType: formData.relatedType,
        relatedId: formData.relatedId,
        relatedName: formData.relatedName,
        author: formData.author,
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical & Account Notes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Institutional knowledge repository for physician feedback, protocol evaluations, and strategy memos.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clinical Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, clinical memos, doctors..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700"
        >
          <option value="ALL">All Categories</option>
          <option value="Contact">Physician / Contact Notes</option>
          <option value="Deal">Deal & Contract Notes</option>
          <option value="General">General Clinical Memos</option>
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {note.relatedType}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(note)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(note.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug group-hover:text-indigo-600 transition-colors">
                {note.title}
              </h3>

              {note.relatedName && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{note.relatedName}</span>
                </p>
              )}

              <p className="text-xs text-slate-600 mt-3 leading-relaxed whitespace-pre-line line-clamp-6">
                {note.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{note.author}</span>
              <span>{note.updatedAt.slice(0, 10)}</span>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            No clinical notes found.
          </div>
        )}
      </div>

      {/* ADD / EDIT NOTE MODAL */}
      {(isAddModalOpen || editingNote) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingNote ? 'Edit Clinical Memo' : 'Create Clinical Note'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingNote(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Clinical Advisory Committee Debrief"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.relatedType}
                    onChange={(e) => setFormData({ ...formData, relatedType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Contact">Contact / Physician</option>
                    <option value="Deal">Deal / Pipeline Opportunity</option>
                    <option value="General">General Memo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Link with Record</label>
                  <select
                    value={formData.relatedId}
                    onChange={(e) => {
                      const c = contacts.find((item) => item.id === e.target.value);
                      setFormData({
                        ...formData,
                        relatedId: e.target.value,
                        relatedName: c ? `${c.firstName} ${c.lastName}` : 'General',
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">General (No Link)</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.organization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Clinical observations, feedback on device efficacy, pricing discussions..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  {editingNote ? 'Save Note' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Clinical Note"
        message="Are you sure you want to permanently delete this memo?"
        confirmLabel="Delete Note"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteNote(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
