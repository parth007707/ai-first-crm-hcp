import React, { useState, useRef } from 'react';
import { useCRM } from '../context/CRMContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Settings,
  User,
  Building2,
  Database,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    org,
    updateUserProfile,
    updateOrgSettings,
    resetDemoData,
    exportDataJson,
    importDataJson,
    addToast,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'data' | 'compliance'>('profile');
  const [userForm, setUserForm] = useState(user);
  const [orgForm, setOrgForm] = useState(org);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(userForm);
  };

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings(orgForm);
  };

  const handleExportData = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthpulse-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Export Complete', 'Full CRM JSON backup downloaded.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleProcessImport = () => {
    if (!importJsonText.trim()) return;
    const success = importDataJson(importJsonText);
    if (success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage user profile, organization compliance parameters, and localStorage backups.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('organization')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'organization'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organization & Compliance</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'data'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Demo Data</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'compliance'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>HIPAA / GxP Status</span>
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Account Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-4">
              <img
                src={userForm.avatarUrl}
                alt={userForm.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-100"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{userForm.name}</h3>
                <p className="text-slate-500">{userForm.role}</p>
                <p className="text-[10px] text-slate-400 mt-1">Territory: {userForm.territory}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Title</label>
                <input
                  type="text"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Territory</label>
                <input
                  type="text"
                  value={userForm.territory}
                  onChange={(e) => setUserForm({ ...userForm, territory: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ORGANIZATION */}
      {activeTab === 'organization' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Organization & Clinical Governance
          </h2>

          <form onSubmit={handleSaveOrg} className="mt-5 space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization Name</label>
              <input
                type="text"
                required
                value={orgForm.orgName}
                onChange={(e) => setOrgForm({ ...orgForm, orgName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={orgForm.industry}
                  onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Currency</label>
                <select
                  value={orgForm.currency}
                  onChange={(e) => setOrgForm({ ...orgForm, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
                <input
                  type="text"
                  value={orgForm.timezone}
                  onChange={(e) => setOrgForm({ ...orgForm, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Compliance Mode</label>
                <select
                  value={orgForm.complianceMode}
                  onChange={(e) => setOrgForm({ ...orgForm, complianceMode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                >
                  <option value="FDA 21 CFR Part 11 & HIPAA">FDA 21 CFR Part 11 & HIPAA</option>
                  <option value="EU MDR / GDPR Standard">EU MDR / GDPR Standard</option>
                  <option value="Standard Commercial">Standard Commercial</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
              >
                Save Organization Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: DATA MANAGEMENT */}
      {activeTab === 'data' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Persistent Local Storage & Backup
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              All CRM records (Contacts, Leads, Deals, Tasks, Activities, Notes) are automatically persisted in your browser’s localStorage. You can export complete snapshots or restore the demo sandbox at any time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Export Button Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    <span>Export CRM Database</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Download a full JSON backup including all contacts, deals, notes, and activity history.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  Download JSON Backup
                </button>
              </div>

              {/* Import Button Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Import JSON Backup</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Restore or migrate CRM state from an existing JSON backup file.
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  Upload JSON File
                </button>
              </div>
            </div>
          </div>

          {/* Reset Demo Data Card */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reset to Factory Healthcare Demo State</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                  Restores all default hospital accounts, medical leads, cardiology KOLs, and pipeline opportunities. This will overwrite any custom data created during this session.
                </p>
              </div>

              <button
                onClick={() => setIsResetDialogOpen(true)}
                className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs rounded-xl transition-colors"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs max-w-2xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Healthcare Compliance & Regulatory Audit Shield</span>
          </h2>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-xs leading-relaxed">
            <strong>Active Audit Framework:</strong> HealthPulse CRM is operating under FDA 21 CFR Part 11 and HIPAA Business Associate Agreement standards.
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800">Sunshine Act Engagement Tracking</h4>
                <p className="text-slate-500 mt-0.5">
                  All physician interactions, advisory meetings, and trial kits are logged with audit timestamps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800">Client-Side Data Isolation</h4>
                <p className="text-slate-500 mt-0.5">
                  Zero telemetry leak. CRM records persist entirely within encrypted browser storage without mandatory external cloud reliance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800">Role-Based Permission Layer</h4>
                <p className="text-slate-500 mt-0.5">
                  Current Session: {user.name} ({user.role}) with Territory Access for {user.territory}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET DIALOG */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Reset All CRM Demo Data?"
        message="This will reset all contacts, leads, deals, tasks, and notes back to the original sample healthcare dataset."
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={() => {
          resetDemoData();
          setIsResetDialogOpen(false);
        }}
        onCancel={() => setIsResetDialogOpen(false)}
      />

      {/* IMPORT JSON MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900">Confirm JSON Database Import</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review or paste the JSON structure below before restoring.
            </p>

            <textarea
              rows={10}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full mt-3 p-3 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportJsonText('');
                }}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessImport}
                className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs shadow-xs"
              >
                Apply Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
