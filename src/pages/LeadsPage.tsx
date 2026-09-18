import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Lead, LeadStatus, LeadPriority, LeadSource } from '../types/crm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Search,
  Plus,
  Target,
  ArrowRight,
  Sparkles,
  DollarSign,
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const { leads, addLead, updateLead, deleteLead, convertLead } = useCRM();

  // Filters & State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Conversion Form State
  const [convertDealName, setConvertDealName] = useState('');
  const [convertDealValue, setConvertDealValue] = useState<number>(50000);
  const [createDealChecked, setCreateDealChecked] = useState(true);

  // Lead Form State
  const [formData, setFormData] = useState({
    leadName: '',
    organization: '',
    email: '',
    phone: '',
    source: 'Conference' as LeadSource,
    status: 'New' as LeadStatus,
    priority: 'Medium' as LeadPriority,
    estimatedValue: 45000,
    owner: 'Parth Atrishi',
    notes: '',
  });

  const filteredLeads = leads.filter((l) => {
    const matchSearch =
      l.leadName.toLowerCase().includes(search.toLowerCase()) ||
      l.organization.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || l.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleOpenAdd = () => {
    setFormData({
      leadName: '',
      organization: '',
      email: '',
      phone: '',
      source: 'Conference',
      status: 'New',
      priority: 'Medium',
      estimatedValue: 50000,
      owner: 'Parth Atrishi',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (l: Lead) => {
    setEditingLead(l);
    setFormData({
      leadName: l.leadName,
      organization: l.organization,
      email: l.email,
      phone: l.phone,
      source: l.source,
      status: l.status,
      priority: l.priority,
      estimatedValue: l.estimatedValue,
      owner: l.owner,
      notes: l.notes || '',
    });
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leadName.trim() || !formData.organization.trim()) return;

    if (editingLead) {
      updateLead(editingLead.id, {
        leadName: formData.leadName,
        organization: formData.organization,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        estimatedValue: Number(formData.estimatedValue) || 0,
        owner: formData.owner,
        notes: formData.notes,
      });
      setEditingLead(null);
    } else {
      addLead({
        leadName: formData.leadName,
        organization: formData.organization,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        estimatedValue: Number(formData.estimatedValue) || 0,
        owner: formData.owner,
        notes: formData.notes,
      });
      setIsAddModalOpen(false);
    }
  };

  const handleOpenConvert = (lead: Lead) => {
    setConvertingLead(lead);
    setConvertDealName(`${lead.organization} Expansion`);
    setConvertDealValue(lead.estimatedValue || 50000);
    setCreateDealChecked(true);
  };

  const handleConfirmConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;

    convertLead(convertingLead.id, {
      createDeal: createDealChecked,
      dealName: convertDealName,
      dealValue: convertDealValue,
    });

    setConvertingLead(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Inbound Leads</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track inquiries from medical symposia, health network RFPs, and trial centers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Capture New Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lead name, hospital, email..."
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
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Unqualified">Unqualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Lead / Contact</th>
                <th className="px-5 py-3.5">Hospital / Organization</th>
                <th className="px-5 py-3.5">Source</th>
                <th className="px-5 py-3.5">Est. Value</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Convert / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Lead Name */}
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{lead.leadName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{lead.email}</span>
                      <span>•</span>
                      <span>{lead.phone}</span>
                    </div>
                  </td>

                  {/* Organization */}
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {lead.organization}
                  </td>

                  {/* Source */}
                  <td className="px-5 py-3.5 text-slate-600">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium">
                      {lead.source}
                    </span>
                  </td>

                  {/* Est Value */}
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    ${lead.estimatedValue.toLocaleString()}
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        lead.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : lead.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : lead.priority === 'Medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-3.5">
                    <select
                      value={lead.status}
                      disabled={lead.status === 'Converted'}
                      onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 ${
                        lead.status === 'Converted'
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : lead.status === 'Qualified'
                          ? 'bg-indigo-100 text-indigo-800'
                          : lead.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Unqualified">Unqualified</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>

                  {/* Actions / Convert */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {lead.status !== 'Converted' && (
                        <button
                          onClick={() => handleOpenConvert(lead)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Convert to Contact & Deal"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Convert</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEdit(lead)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTargetId(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                    No leads found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredLeads.length} of {leads.length} Leads</span>
          <span className="font-semibold text-indigo-600">
            Pipeline Potential: $
            {filteredLeads
              .filter((l) => l.status !== 'Converted' && l.status !== 'Lost')
              .reduce((s, l) => s + l.estimatedValue, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>

      {/* LEAD CONVERSION MODAL */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Convert Lead to Customer</h3>
                  <p className="text-xs text-slate-400">{convertingLead.leadName}</p>
                </div>
              </div>
              <button
                onClick={() => setConvertingLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmConvert} className="py-4 space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
                A new <strong>Healthcare Contact</strong> will be created for{' '}
                <strong>{convertingLead.leadName}</strong> ({convertingLead.organization}).
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="createDealCheck"
                  checked={createDealChecked}
                  onChange={(e) => setCreateDealChecked(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="createDealCheck" className="text-xs font-semibold text-slate-800">
                  Also spawn a Deal in the Sales Pipeline
                </label>
              </div>

              {createDealChecked && (
                <div className="space-y-3 pl-6 border-l-2 border-indigo-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title</label>
                    <input
                      type="text"
                      required
                      value={convertDealName}
                      onChange={(e) => setConvertDealName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Value ($)</label>
                    <input
                      type="number"
                      required
                      value={convertDealValue}
                      onChange={(e) => setConvertDealValue(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  Confirm Conversion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT LEAD MODAL */}
      {(isAddModalOpen || editingLead) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingLead ? 'Edit Lead Record' : 'Capture New Inbound Lead'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingLead(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead / Physician Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Dr. Maya Patel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Baystate Health"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="lead@hospital.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="+1 (555) 0192"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="Conference">Conference</option>
                    <option value="Hospital Network">Hospital Network</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Inbound">Inbound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Unqualified">Unqualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Value ($)</label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Owner</label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry / Clinical Request</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Requested trial kit, formulary pricing, or regulatory data..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingLead(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                >
                  {editingLead ? 'Save Changes' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Inbound Lead"
        message="Are you sure you want to delete this lead? This cannot be undone."
        confirmLabel="Delete Lead"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteLead(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
