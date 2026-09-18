import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Deal, DealStage } from '../types/crm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Briefcase,
  Plus,
  Search,
  Kanban,
  Table as TableIcon,
  DollarSign,
  Calendar,
  Building2,
  User,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

const STAGES: DealStage[] = [
  'Qualification',
  'Discovery',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

export const DealsPage: React.FC = () => {
  const { deals, contacts, addDeal, updateDeal, updateDealStage, deleteDeal } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    dealName: '',
    organization: '',
    contactName: '',
    value: 75000,
    stage: 'Qualification' as DealStage,
    probability: 20,
    expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    owner: 'Parth Atrishi',
    notes: '',
  });

  const filteredDeals = deals.filter((d) => {
    const matchSearch =
      d.dealName.toLowerCase().includes(search.toLowerCase()) ||
      d.organization.toLowerCase().includes(search.toLowerCase()) ||
      d.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'ALL' || d.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const wonValue = deals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.value, 0);

  const handleOpenAdd = () => {
    setFormData({
      dealName: '',
      organization: contacts[0]?.organization || 'Mayo Clinic Health System',
      contactName: contacts[0] ? `${contacts[0].firstName} ${contacts[0].lastName}` : 'Dr. Aris Thorne',
      value: 85000,
      stage: 'Qualification',
      probability: 20,
      expectedCloseDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      owner: 'Parth Atrishi',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      dealName: deal.dealName,
      organization: deal.organization,
      contactName: deal.contactName,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate,
      owner: deal.owner,
      notes: deal.notes || '',
    });
  };

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dealName.trim()) return;

    if (editingDeal) {
      updateDeal(editingDeal.id, {
        dealName: formData.dealName,
        organization: formData.organization,
        contactName: formData.contactName,
        value: Number(formData.value) || 0,
        stage: formData.stage,
        probability: Number(formData.probability) || 0,
        expectedCloseDate: formData.expectedCloseDate,
        owner: formData.owner,
        notes: formData.notes,
      });
      setEditingDeal(null);
    } else {
      addDeal({
        dealName: formData.dealName,
        organization: formData.organization,
        contactName: formData.contactName,
        value: Number(formData.value) || 0,
        stage: formData.stage,
        probability: Number(formData.probability) || 20,
        expectedCloseDate: formData.expectedCloseDate,
        owner: formData.owner,
        notes: formData.notes,
      });
      setIsAddModalOpen(false);
    }
  };

  const moveStage = (dealId: string, currentStage: DealStage, direction: 'forward' | 'backward') => {
    const currentIndex = STAGES.indexOf(currentStage);
    const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < STAGES.length) {
      updateDealStage(dealId, STAGES[newIndex]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deal Pipeline & Opportunities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track hospital contracts, enterprise health formulary deals, and clinical rollout milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Total Active Pipeline</span>
          <div className="text-xl font-bold text-slate-900 mt-1">${totalPipelineValue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Closed Won Revenue</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">${wonValue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Total Opportunities</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{deals.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Avg Deal Size</span>
          <div className="text-xl font-bold text-indigo-600 mt-1">
            ${Math.round(totalPipelineValue / (deals.length || 1)).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals, hospitals, contacts..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {viewMode === 'table' && (
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Pipeline Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage}
                className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col min-w-[240px]"
              >
                {/* Stage Header */}
                <div className="pb-3 mb-2 border-b border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800">{stage}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white border text-slate-600">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-700 mt-1">
                    ${stageTotal.toLocaleString()}
                  </div>
                </div>

                {/* Deal Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                            {deal.dealName}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(deal)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(deal.id)}
                              className="text-slate-400 hover:text-rose-600 p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{deal.organization}</span>
                        </p>

                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{deal.contactName}</span>
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900">
                            ${deal.value.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {deal.probability}% prob
                          </span>
                        </div>
                      </div>

                      {/* Stage Move Controls */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          disabled={STAGES.indexOf(deal.stage) === 0}
                          onClick={() => moveStage(deal.id, deal.stage, 'backward')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded transition-colors"
                          title="Move stage backward"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Due {deal.expectedCloseDate.slice(5)}
                        </span>
                        <button
                          disabled={STAGES.indexOf(deal.stage) === STAGES.length - 1}
                          onClick={() => moveStage(deal.id, deal.stage, 'forward')}
                          className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-20 hover:bg-slate-100 rounded transition-colors"
                          title="Move stage forward"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-[11px] border-2 border-dashed border-slate-200/80 rounded-xl">
                      No opportunities
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Deal Opportunity</th>
                  <th className="px-5 py-3.5">Hospital / Client</th>
                  <th className="px-5 py-3.5">Key Contact</th>
                  <th className="px-5 py-3.5">Value ($)</th>
                  <th className="px-5 py-3.5">Stage</th>
                  <th className="px-5 py-3.5">Expected Close</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{deal.dealName}</div>
                      <div className="text-[11px] text-slate-400">Owner: {deal.owner}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{deal.organization}</td>
                    <td className="px-5 py-3.5 text-slate-600">{deal.contactName}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">${deal.value.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={deal.stage}
                        onChange={(e) => updateDealStage(deal.id, e.target.value as DealStage)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 ${
                          deal.stage === 'Closed Won'
                            ? 'bg-emerald-100 text-emerald-800'
                            : deal.stage === 'Closed Lost'
                            ? 'bg-slate-200 text-slate-700'
                            : deal.stage === 'Negotiation'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                      {deal.expectedCloseDate}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(deal)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(deal.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT DEAL MODAL */}
      {(isAddModalOpen || editingDeal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingDeal ? 'Edit Clinical Deal' : 'Add New Clinical Opportunity'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDeal(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={formData.dealName}
                  onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                  placeholder="e.g. Health Network Formulary Contract"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Account</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Physician / Decision Maker</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Value ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Close Probability (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Close Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Remarks & Milestones</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Terms, IRB approvals, budget timeline..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDeal(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  {editingDeal ? 'Save Deal' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Remove Deal"
        message="Are you sure you want to delete this opportunity? Historical analytics may be affected."
        confirmLabel="Delete Deal"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteDeal(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
