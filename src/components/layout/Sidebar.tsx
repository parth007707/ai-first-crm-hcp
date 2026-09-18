import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import {
  LayoutDashboard,
  Users,
  Target,
  Briefcase,
  Activity as ActivityIcon,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  HeartPulse,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { contacts, leads, deals, tasks } = useCRM();

  const activeLeadsCount = leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length;
  const openDealsCount = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Contacts', path: '/contacts', icon: Users, badge: contacts.length },
    { name: 'Leads', path: '/leads', icon: Target, badge: activeLeadsCount },
    { name: 'Deals / Pipeline', path: '/deals', icon: Briefcase, badge: openDealsCount },
    { name: 'Activities', path: '/activities', icon: ActivityIcon },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, badge: pendingTasksCount },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'QMS & Quality', path: '/qms', icon: ShieldCheck },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Name */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                HealthPulse <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">CRM</span>
              </span>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">HCP Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Pro Account / Regulatory Compliance Banner */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 m-3 rounded-2xl border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">GxP Compliance</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
              Audit Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            HIPAA & Sunshine Act tracking active across all Physician engagements.
          </p>
        </div>
      </aside>
    </>
  );
};
