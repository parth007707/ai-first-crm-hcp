import React, { useState } from 'react';
import {
  ClipboardList,
  ShieldAlert,
  AlertTriangle,
  Package,
  BadgeAlert,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  FileCheck,
  Search,
  Filter,
  ShieldCheck,
  Clock
} from 'lucide-react';
import {
  Deviation,
  DeviationStage,
  ProductComplaint,
  AdverseEvent,
  ProductRecall,
  UserRole
} from '../types';
import {
  INITIAL_DEVIATIONS,
  INITIAL_COMPLAINTS,
  INITIAL_ADVERSE_EVENTS,
  INITIAL_RECALLS
} from '../mockData';
import { useCRM } from '../context/CRMContext';

export const QmsPage: React.FC = () => {
  const { addToast } = useCRM();

  // Role
  const [currentRole, setCurrentRole] = useState<UserRole>('QA_OFFICER');

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'capa' | 'complaints' | 'recalls'>('capa');

  // State
  const [deviations, setDeviations] = useState<Deviation[]>(INITIAL_DEVIATIONS);
  const [selectedDeviation, setSelectedDeviation] = useState<Deviation | null>(INITIAL_DEVIATIONS[0]);
  const [rootCauseInput, setRootCauseInput] = useState<string>('');
  const [capaActionInput, setCapaActionInput] = useState<string>('');

  const [complaints] = useState<ProductComplaint[]>(INITIAL_COMPLAINTS);
  const [adverseEvents] = useState<AdverseEvent[]>(INITIAL_ADVERSE_EVENTS);
  const [recalls] = useState<ProductRecall[]>(INITIAL_RECALLS);

  // Advance CAPA Stage
  const handleAdvanceDeviation = (deviationId: string) => {
    const stageFlow: DeviationStage[] = [
      'Issue Logged',
      'Root Cause Analysis',
      'Action Planned',
      'Verified',
      'Closed',
    ];

    setDeviations((prev) =>
      prev.map((d) => {
        if (d.id !== deviationId) return d;
        const currentIdx = stageFlow.indexOf(d.stage);
        const nextStage = stageFlow[Math.min(currentIdx + 1, stageFlow.length - 1)];

        const updated: Deviation = {
          ...d,
          stage: nextStage,
          rootCause: rootCauseInput || d.rootCause,
          capaAction: capaActionInput || d.capaAction,
          closedAt: nextStage === 'Closed' ? new Date().toISOString() : d.closedAt,
        };
        if (selectedDeviation?.id === d.id) setSelectedDeviation(updated);
        return updated;
      })
    );

    addToast(
      'success',
      'CAPA Stage Advanced',
      `Deviation ${deviationId} progressed under role ${currentRole}.`
    );
    setRootCauseInput('');
    setCapaActionInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quality Management (QMS) & CAPA Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            21 CFR Part 820 & ISO 13485 Manufacturing deviations, complaints, and CAPA lifecycle.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl text-xs">
          <span className="text-slate-400 font-semibold px-2">Role:</span>
          {(['QA_OFFICER', 'PRODUCTION_MANAGER', 'FIELD_REP'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                currentRole === r
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'QA_OFFICER'
                ? 'QA Officer'
                : r === 'PRODUCTION_MANAGER'
                ? 'Production Mgr'
                : 'Field Rep'}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('capa')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'capa'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Deviations & CAPA Flow ({deviations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'complaints'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Complaints ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('recalls')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'recalls'
              ? 'bg-indigo-50 text-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Adverse Events & Recalls ({adverseEvents.length + recalls.length})</span>
        </button>
      </div>

      {/* VIEW 1: CAPA WORKFLOW */}
      {activeSubTab === 'capa' && (
        <div className="space-y-6">
          {/* 5-Step Lifecycle Visualizer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>CAPA Audit Stage Progression</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Standard SOP-QMS-401</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-semibold">
              {['Issue Logged', 'Root Cause Analysis', 'Action Planned', 'Verified', 'Closed'].map(
                (stg, idx) => {
                  const isCurrent = selectedDeviation?.stage === stg;
                  return (
                    <div
                      key={stg}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isCurrent
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[11px] leading-tight">{stg}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Master-Detail Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Deviations List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Active Batch Deviations
              </div>

              {deviations.map((dev) => {
                const isSelected = selectedDeviation?.id === dev.id;
                return (
                  <div
                    key={dev.id}
                    onClick={() => setSelectedDeviation(dev)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-indigo-500 ring-2 ring-indigo-50 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-900">{dev.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          dev.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : dev.severity === 'Major'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {dev.severity}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {dev.title}
                    </h4>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Batch: <strong className="text-slate-700">{dev.batchNumber}</strong></span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                        {dev.stage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Deviation Detail */}
            {selectedDeviation && (
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="font-mono text-xs text-slate-400">{selectedDeviation.id}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {selectedDeviation.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Discovered in <strong>{selectedDeviation.department}</strong> on{' '}
                        {selectedDeviation.detectedAt} by {selectedDeviation.detectedBy}
                      </p>
                    </div>

                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                      {selectedDeviation.stage}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Discrepancy Description
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 p-3.5 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">
                      {selectedDeviation.description}
                    </p>
                  </div>

                  {/* Root cause */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Root Cause Analysis
                    </h4>
                    {selectedDeviation.rootCause ? (
                      <p className="text-xs text-slate-700 mt-1 p-3.5 bg-amber-50/40 rounded-xl border border-amber-100 leading-relaxed">
                        {selectedDeviation.rootCause}
                      </p>
                    ) : (
                      <div className="mt-1">
                        <textarea
                          rows={2}
                          value={rootCauseInput}
                          onChange={(e) => setRootCauseInput(e.target.value)}
                          placeholder="Input root cause findings from technical investigation..."
                          className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* CAPA action */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Corrective & Preventive Action (CAPA)
                    </h4>
                    {selectedDeviation.capaAction ? (
                      <p className="text-xs text-slate-700 mt-1 p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 leading-relaxed">
                        {selectedDeviation.capaAction}
                      </p>
                    ) : (
                      <div className="mt-1">
                        <textarea
                          rows={2}
                          value={capaActionInput}
                          onChange={(e) => setCapaActionInput(e.target.value)}
                          placeholder="Specify corrective procedures, calibration adjustments, or re-training..."
                          className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {selectedDeviation.verificationNotes && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        QA Verification Audit Notes
                      </h4>
                      <p className="text-xs text-slate-700 mt-1 p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 leading-relaxed">
                        {selectedDeviation.verificationNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Assigned Role: <strong>{selectedDeviation.assignedRole}</strong>
                  </span>

                  {selectedDeviation.stage !== 'Closed' ? (
                    <button
                      onClick={() => handleAdvanceDeviation(selectedDeviation.id)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Advance to Next Stage</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Regulatory Sign-off Completed</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: PRODUCT COMPLAINTS */}
      {activeSubTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Registered Field Complaints</h3>
            <p className="text-xs text-slate-400">Post-market clinical vigilance records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Complaint #</th>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Lot / Batch</th>
                  <th className="px-5 py-3.5">Reported By</th>
                  <th className="px-5 py-3.5">Nature of Complaint</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{c.complaintNumber}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{c.product}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{c.batchNumber}</td>
                    <td className="px-5 py-3.5 text-slate-700">{c.reportedBy} ({c.reporterType})</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs">{c.category}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: ADVERSE EVENTS & RECALL PROTOCOLS */}
      {activeSubTab === 'recalls' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <BadgeAlert className="w-4 h-4 text-rose-600" />
              <span>FDA MedWatch 3500A Mandatory Adverse Events</span>
            </h3>

            <div className="divide-y divide-slate-100 mt-3">
              {adverseEvents.map((ae) => (
                <div key={ae.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{ae.caseId}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                        {ae.seriousnessCriteria}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold mt-1">
                      {ae.suspectDrug} — Patient {ae.patientInitials} (Reported by {ae.hcpReporter})
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{ae.reactionDescription}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono text-slate-400">Date: {ae.reportedDate}</span>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                      FDA MDR: {ae.fdaMdrStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Simulated Product Recalls & Containment</span>
            </h3>

            <div className="divide-y divide-slate-100 mt-3">
              {recalls.map((rec) => (
                <div key={rec.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{rec.recallCode}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                      {rec.classification}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800">{rec.productName}</h4>
                  <p className="text-xs text-slate-600">Recovery Rate: {rec.recoveryRatePercent}% (Initiated: {rec.initiationDate})</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Batches affected: {rec.affectedBatches.join(', ')}</span>
                    <span className="font-semibold text-slate-700">Status: {rec.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
