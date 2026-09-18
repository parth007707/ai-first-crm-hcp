import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Activity, ActivityType } from '../types/crm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Activity as ActivityIcon,
  Phone,
  Mail,
  Calendar,
  FileText,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  User
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { activities, contacts, addActivity, updateActivity, deleteActivity } = useCRM();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form
  const [formData, setFormData] = useState({
    relatedName: contacts[0] ? `${contacts[0].firstName} ${contacts[0].lastName}` : 'Dr. Aris Thorne',
    contactId: contacts[0]?.id || '',
    type: 'Call' as ActivityType,
    subject: '',
    description: '',
    dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Completed' as Activity['status'],
  });

  const filtered = activities.filter((a) => {
    const matchSearch =
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.relatedName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || a.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleOpenAdd = () => {
    setFormData({
      relatedName: contacts[0] ? `${contacts[0].firstName} ${contacts[0].lastName}` : 'Dr. Aris Thorne',
      contactId: contacts[0]?.id || '',
      type: 'Call',
      subject: '',
      description: '',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Completed',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (a: Activity) => {
    setEditingActivity(a);
    setFormData({
      relatedName: a.relatedName,
      contactId: a.contactId || '',
      type: a.type,
      subject: a.subject,
      description: a.description,
      dateTime: a.dateTime,
      status: a.status,
    });
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;

    if (editingActivity) {
      updateActivity(editingActivity.id, {
        relatedName: formData.relatedName,
        contactId: formData.contactId,
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
        dateTime: formData.dateTime,
        status: formData.status,
      });
      setEditingActivity(null);
    } else {
      addActivity({
        relatedName: formData.relatedName,
        contactId: formData.contactId,
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
        dateTime: formData.dateTime,
        status: formData.status,
      });
      setIsAddModalOpen(false);
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'Meeting':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'Note':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'Follow-up':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Engagement Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit-ready chronological history of calls, symposia, and clinical briefings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity</span>
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
            placeholder="Search engagement topics, doctors, notes..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Activity Types</option>
            <option value="Meeting">Meetings</option>
            <option value="Call">Phone Calls</option>
            <option value="Email">Emails</option>
            <option value="Follow-up">Follow-ups</option>
            <option value="Note">Notes</option>
          </select>
        </div>
      </div>

      {/* Activities Timeline Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {filtered.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-500 group-hover:scale-110 transition-all shadow-2xs">
                {getActivityIcon(act.type)}
              </div>

              {/* Activity Card */}
              <div className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-200 shadow-2xs transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {act.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{act.subject}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{act.dateTime}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        act.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">With {act.relatedName}</span>
                </div>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200/60">
                  {act.description}
                </p>

                {/* Card footer actions */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => handleOpenEdit(act)}
                    className="text-slate-400 hover:text-slate-700 p-1 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(act.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No clinical activities recorded matching current criteria.
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT ACTIVITY MODAL */}
      {(isAddModalOpen || editingActivity) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingActivity ? 'Edit Engagement Record' : 'Log Clinical Activity'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingActivity(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ActivityType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Note">Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Related Physician / HCP</label>
                <select
                  value={formData.contactId}
                  onChange={(e) => {
                    const c = contacts.find((item) => item.id === e.target.value);
                    setFormData({
                      ...formData,
                      contactId: e.target.value,
                      relatedName: c ? `${c.firstName} ${c.lastName}` : formData.relatedName,
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.organization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Clinical Trial Protocol Review"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date & Time</label>
                <input
                  type="text"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  placeholder="YYYY-MM-DD HH:mm"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Summary & Outcomes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Discussion points, regulatory considerations, next steps..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingActivity(null);
                  }}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  {editingActivity ? 'Save Changes' : 'Log Engagement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Engagement Record"
        message="Are you sure you want to remove this activity from the audit log?"
        confirmLabel="Delete Activity"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteActivity(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
