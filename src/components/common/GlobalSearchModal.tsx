import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { Search, X, Users, Target, Briefcase, CheckSquare, FileText, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { contacts, leads, deals, tasks, notes } = useCRM();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedContacts = q
    ? contacts.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.organization.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.jobTitle.toLowerCase().includes(q)
      )
    : [];

  const matchedLeads = q
    ? leads.filter(
        (l) =>
          l.leadName.toLowerCase().includes(q) ||
          l.organization.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      )
    : [];

  const matchedDeals = q
    ? deals.filter(
        (d) =>
          d.dealName.toLowerCase().includes(q) ||
          d.organization.toLowerCase().includes(q) ||
          d.contactName.toLowerCase().includes(q)
      )
    : [];

  const matchedTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.relatedName && t.relatedName.toLowerCase().includes(q))
      )
    : [];

  const matchedNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.relatedName && n.relatedName.toLowerCase().includes(q))
      )
    : [];

  const totalResults =
    matchedContacts.length +
    matchedLeads.length +
    matchedDeals.length +
    matchedTasks.length +
    matchedNotes.length;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts, clinical leads, deals, tasks, notes..."
            className="flex-1 text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-4">
          {!q && (
            <div className="py-8 text-center text-slate-400 text-xs">
              Type to instantly search across all Healthcare CRM records.
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No matching records found for "{query}".
            </div>
          )}

          {/* Contacts */}
          {matchedContacts.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Contacts ({matchedContacts.length})</span>
              </div>
              <div className="space-y-1">
                {matchedContacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('/contacts')}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                        {c.firstName} {c.lastName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {c.jobTitle} • {c.organization}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>Leads ({matchedLeads.length})</span>
              </div>
              <div className="space-y-1">
                {matchedLeads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect('/leads')}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                        {l.leadName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {l.organization} • ${l.estimatedValue.toLocaleString()} ({l.status})
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {matchedDeals.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Deals ({matchedDeals.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDeals.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect('/deals')}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                        {d.dealName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {d.organization} • ${d.value.toLocaleString()} ({d.stage})
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Tasks ({matchedTasks.length})</span>
              </div>
              <div className="space-y-1">
                {matchedTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect('/tasks')}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                        {t.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        Due {t.dueDate} • Priority: {t.priority} ({t.status})
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {matchedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Notes ({matchedNotes.length})</span>
              </div>
              <div className="space-y-1">
                {matchedNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect('/notes')}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                        {n.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-md">
                        {n.content}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Search index updated live from local CRM state</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
