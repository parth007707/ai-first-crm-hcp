import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  Contact,
  ContactStatus,
  LeadSource
} from '../types/crm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Building2,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Activity as ActivityIcon,
  X,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, addNote, addActivity } = useCRM();

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [orgFilter, setOrgFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'org' | 'activity'>('name');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [detailContact, setDetailContact] = useState<Contact | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    status: 'Active' as ContactStatus,
    leadSource: 'Hospital Network' as LeadSource,
    tags: '',
    notes: '',
  });

  // Inline Note / Activity in Drawer
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newActivitySubject, setNewActivitySubject] = useState('');
  const [newActivityType, setNewActivityType] = useState<'Call' | 'Email' | 'Meeting' | 'Note' | 'Follow-up'>('Call');

  // Unique orgs for filter
  const organizations = Array.from(new Set(contacts.map((c) => c.organization))).sort();

  // Filter & Sort Logic
  const filtered = contacts
    .filter((c) => {
      const matchSearch =
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.organization.toLowerCase().includes(search.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchOrg = orgFilter === 'ALL' || c.organization === orgFilter;
      return matchSearch && matchStatus && matchOrg;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.firstName.localeCompare(b.firstName);
      if (sortBy === 'org') return a.organization.localeCompare(b.organization);
      return b.lastActivity.localeCompare(a.lastActivity);
    });

  const handleOpenAdd = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      jobTitle: '',
      status: 'Active',
      leadSource: 'Hospital Network',
      tags: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (c: Contact) => {
    setEditingContact(c);
    setFormData({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      organization: c.organization,
      jobTitle: c.jobTitle,
      status: c.status,
      leadSource: c.leadSource,
      tags: c.tags.join(', '),
      notes: c.notes,
    });
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;

    const formattedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingContact) {
      updateContact(editingContact.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        jobTitle: formData.jobTitle,
        status: formData.status,
        leadSource: formData.leadSource,
        tags: formattedTags,
        notes: formData.notes,
      });
      setEditingContact(null);
      if (detailContact?.id === editingContact.id) {
        setDetailContact({ ...detailContact, ...formData, tags: formattedTags });
      }
    } else {
      addContact({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        jobTitle: formData.jobTitle,
        status: formData.status,
        leadSource: formData.leadSource,
        tags: formattedTags,
        notes: formData.notes,
      });
      setIsAddModalOpen(false);
    }
  };

  const handleAddInlineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailContact || !newNoteContent.trim()) return;
    addNote({
      title: `Meeting Note: ${detailContact.firstName} ${detailContact.lastName}`,
      content: newNoteContent,
      relatedType: 'Contact',
      relatedId: detailContact.id,
      relatedName: `${detailContact.firstName} ${detailContact.lastName}`,
      author: 'Parth Atrishi',
    });
    setNewNoteContent('');
  };

  const handleAddInlineActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailContact || !newActivitySubject.trim()) return;
    addActivity({
      contactId: detailContact.id,
      relatedName: `${detailContact.firstName} ${detailContact.lastName}`,
      type: newActivityType,
      subject: newActivitySubject,
      description: `Logged via Contact Detail view for ${detailContact.organization}.`,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Completed',
    });
    setNewActivitySubject('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Healthcare Contacts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Directory of Key Opinion Leaders, Hospital Heads, and Clinical Decision Makers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Healthcare Professional</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by physician, hospital, specialty..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Champion">Champion (KOL)</option>
            <option value="Active">Active</option>
            <option value="Prospect">Prospect</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Org Filter */}
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[180px] truncate"
          >
            <option value="ALL">All Organizations</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="org">Sort: Organization</option>
            <option value="activity">Sort: Recent Activity</option>
          </select>
        </div>
      </div>

      {/* Contacts Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Physician / Name</th>
                <th className="px-5 py-3.5">Organization & Title</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Tier / Status</th>
                <th className="px-5 py-3.5">Tags</th>
                <th className="px-5 py-3.5">Last Activity</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <div
                      onClick={() => setDetailContact(contact)}
                      className="cursor-pointer group"
                    >
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <span className="text-[11px] text-slate-400">{contact.leadSource}</span>
                    </div>
                  </td>

                  {/* Organization */}
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-800">{contact.organization}</div>
                    <div className="text-[11px] text-slate-400">{contact.jobTitle}</div>
                  </td>

                  {/* Contact info */}
                  <td className="px-5 py-3.5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{contact.phone}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <select
                      value={contact.status}
                      onChange={(e) => updateContact(contact.id, { status: e.target.value as ContactStatus })}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 ${
                        contact.status === 'Champion'
                          ? 'bg-indigo-100 text-indigo-800'
                          : contact.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : contact.status === 'Prospect'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <option value="Champion">Champion</option>
                      <option value="Active">Active</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>

                  {/* Tags */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {contact.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Last Activity */}
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">
                    {contact.lastActivity}
                  </td>

                  {/* Action buttons */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setDetailContact(contact)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(contact)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Contact"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(contact.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                    No contacts found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {contacts.length} Healthcare Professionals</span>
          <span className="font-mono">GxP Audit Trail Enabled</span>
        </div>
      </div>

      {/* ADD / EDIT CONTACT MODAL */}
      {(isAddModalOpen || editingContact) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingContact ? 'Edit Contact Profile' : 'Add Healthcare Professional'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingContact(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Dr. Aris"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Thorne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="thorne@hospital.org"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="+1 (617) 555-0142"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Hospital</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="St. Jude Heart Institute"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title / Specialty</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Chief of Cardiology"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Engagement Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContactStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Champion">Champion (KOL)</option>
                    <option value="Active">Active</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Acquisition Channel</label>
                  <select
                    value={formData.leadSource}
                    onChange={(e) => setFormData({ ...formData, leadSource: e.target.value as LeadSource })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Hospital Network">Hospital Network</option>
                    <option value="Conference">Conference</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Outreach">Direct Outreach</option>
                    <option value="Website">Website</option>
                    <option value="Inbound">Inbound</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Cardiology, Key Opinion Leader, Formulary Board"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Clinical interests, preferred meeting time, compliance remarks..."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingContact(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  {editingContact ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT DETAIL DRAWER */}
      {detailContact && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {detailContact.status}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {detailContact.firstName} {detailContact.lastName}
                </h3>
                <p className="text-xs text-slate-500">
                  {detailContact.jobTitle} • {detailContact.organization}
                </p>
              </div>
              <button
                onClick={() => setDetailContact(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Communication info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${detailContact.email}`} className="text-indigo-600 hover:underline">
                    {detailContact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{detailContact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{detailContact.organization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Member since: {detailContact.createdDate}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialty Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailContact.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physician Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Physician Insights & Monograph Notes</h4>
                <p className="text-xs text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200/80 leading-relaxed">
                  {detailContact.notes || 'No specific notes recorded for this physician.'}
                </p>
              </div>

              {/* Add Note Section */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Add Quick Meeting Note</span>
                </h4>
                <form onSubmit={handleAddInlineNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Clinical discussion outcome, product preferences..."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newNoteContent.trim()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    Save Note
                  </button>
                </form>
              </div>

              {/* Add Activity Section */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <ActivityIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Log Activity with Physician</span>
                </h4>
                <form onSubmit={handleAddInlineActivity} className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value as any)}
                      className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Call">Call</option>
                      <option value="Email">Email</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                    <input
                      type="text"
                      value={newActivitySubject}
                      onChange={(e) => setNewActivitySubject(e.target.value)}
                      placeholder="e.g. Discussed Phase III readout..."
                      className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newActivitySubject.trim()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    Log Activity
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <button
                onClick={() => handleOpenEdit(detailContact)}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Edit Full Profile
              </button>
              <button
                onClick={() => {
                  setDeleteTargetId(detailContact.id);
                  setDetailContact(null);
                }}
                className="font-semibold text-rose-600 hover:text-rose-700"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Healthcare Professional"
        message="Are you sure you want to delete this contact? This will remove their record from active directory."
        confirmLabel="Delete Contact"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteContact(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
