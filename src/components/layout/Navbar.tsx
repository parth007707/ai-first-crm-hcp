import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Sparkles,
  Bell,
  Plus,
  Users,
  Target,
  Briefcase,
  CheckSquare,
  FileText,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenAi,
}) => {
  const { user, tasks, deals } = useCRM();
  const navigate = useNavigate();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const quickMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setShowQuickMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const urgentTasks = tasks.filter((t) => t.status !== 'Completed' && (t.priority === 'High' || t.priority === 'Urgent'));
  const negotiationDeals = deals.filter((d) => d.stage === 'Negotiation');

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left side: Hamburger & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100/80 hover:bg-slate-100 rounded-xl text-xs sm:text-sm text-slate-500 border border-slate-200/80 transition-all text-left group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
            <span className="truncate">Search HCPs, leads, pipeline deals, tasks...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: AI Copilot, Quick Action, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* AI Copilot Button */}
        <button
          onClick={onOpenAi}
          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center gap-1.5 border border-indigo-200 shadow-2xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Quick Create Dropdown */}
        <div className="relative" ref={quickMenuRef}>
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 hidden sm:inline" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in text-xs font-medium text-slate-700">
              <button
                onClick={() => {
                  navigate('/contacts');
                  setShowQuickMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 hover:text-indigo-600"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Add Contact</span>
              </button>
              <button
                onClick={() => {
                  navigate('/leads');
                  setShowQuickMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 hover:text-indigo-600"
              >
                <Target className="w-4 h-4 text-slate-400" />
                <span>Add Lead</span>
              </button>
              <button
                onClick={() => {
                  navigate('/deals');
                  setShowQuickMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 hover:text-indigo-600"
              >
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>Create Deal</span>
              </button>
              <button
                onClick={() => {
                  navigate('/tasks');
                  setShowQuickMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 hover:text-indigo-600"
              >
                <CheckSquare className="w-4 h-4 text-slate-400" />
                <span>Create Task</span>
              </button>
              <button
                onClick={() => {
                  navigate('/notes');
                  setShowQuickMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 hover:text-indigo-600"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Add Note</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {urgentTasks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {urgentTasks.length + negotiationDeals.length} Action Items
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                {urgentTasks.map((t) => (
                  <div key={t.id} className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-800">{t.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Due: {t.dueDate} • Priority: {t.priority}</p>
                  </div>
                ))}
                {negotiationDeals.map((d) => (
                  <div key={d.id} className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-800">Deal Ready to Close: {d.dealName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">${d.value.toLocaleString()} • {d.probability}% Probability</p>
                  </div>
                ))}
                {urgentTasks.length === 0 && negotiationDeals.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">All alerts cleared!</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar / link to settings */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-2 cursor-pointer group"
          title="Account Settings"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-300 transition-all"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
              {user.name}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
