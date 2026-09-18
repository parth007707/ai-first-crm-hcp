import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Target,
  Briefcase,
  DollarSign,
  CheckSquare,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  Building2,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';
import { DealStage } from '../types/crm';

export const DashboardPage: React.FC = () => {
  const { contacts, leads, deals, tasks, activities, toggleTaskComplete } = useCRM();
  const navigate = useNavigate();

  // Core KPIs
  const totalContacts = contacts.length;
  const activeLeads = leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length;
  const openDeals = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length;
  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const tasksDueToday = tasks.filter((t) => t.status !== 'Completed' && t.dueDate <= todayStr).length;

  const totalClosedDeals = deals.filter((d) => d.stage === 'Closed Won' || d.stage === 'Closed Lost').length;
  const wonDeals = deals.filter((d) => d.stage === 'Closed Won').length;
  const conversionRate = totalClosedDeals > 0 ? Math.round((wonDeals / totalClosedDeals) * 100) : 75;

  // Pipeline by Stage Data
  const stages: DealStage[] = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const pipelineByStage = stages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      stage,
      count: stageDeals.length,
      value: stageValue,
    };
  });
  const maxStageValue = Math.max(...pipelineByStage.map((s) => s.value), 1);

  // Lead Source Breakdown
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });
  const totalLeads = leads.length || 1;
  const leadSourceData = Object.entries(sourceCounts).map(([source, count]) => ({
    source,
    count,
    percent: Math.round((count / totalLeads) * 100),
  }));

  // Recent lists
  const recentContacts = [...contacts].slice(0, 5);
  const recentActivities = [...activities].slice(0, 4);
  const upcomingTasks = tasks.filter((t) => t.status !== 'Completed').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time performance metrics across Healthcare Professional engagements and pipeline.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/contacts')}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>New Contact</span>
          </button>
          <button
            onClick={() => navigate('/leads')}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>New Lead</span>
          </button>
          <button
            onClick={() => navigate('/deals')}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Contacts */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total HCPs</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalContacts}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Active network</span>
          </div>
        </div>

        {/* Card 2: Active Leads */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Leads</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{activeLeads}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">In qualification</div>
        </div>

        {/* Card 3: Open Deals */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Open Deals</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{openDeals}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Active proposals</div>
        </div>

        {/* Card 4: Pipeline Value */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 truncate">
            ${(totalPipelineValue / 1000).toFixed(0)}k
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 truncate">
            ${totalPipelineValue.toLocaleString()}
          </div>
        </div>

        {/* Card 5: Tasks Due */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tasks Due</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{tasksDueToday}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Requires attention</div>
        </div>

        {/* Card 6: Win / Conversion Rate */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Win Rate</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{conversionRate}%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Closed won ratio</div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deal Pipeline by Stage (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Pipeline Value by Stage</h2>
              <p className="text-xs text-slate-400 mt-0.5">Distribution of clinical deals across sales milestones</p>
            </div>
            <button
              onClick={() => navigate('/deals')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Pipeline Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 py-4">
            {pipelineByStage.map((item) => {
              const percentage = Math.round((item.value / maxStageValue) * 100);
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      {item.stage}
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded font-normal">
                        {item.count} {item.count === 1 ? 'deal' : 'deals'}
                      </span>
                    </span>
                    <span className="font-bold text-slate-900">${item.value.toLocaleString()}</span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.stage === 'Closed Won'
                          ? 'bg-emerald-500'
                          : item.stage === 'Closed Lost'
                          ? 'bg-slate-300'
                          : item.stage === 'Negotiation'
                          ? 'bg-indigo-600'
                          : 'bg-indigo-400'
                      }`}
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Evaluated Pipeline: <strong className="text-slate-800">${totalPipelineValue.toLocaleString()}</strong></span>
            <span>Weighted Average Close Rate: <strong>68%</strong></span>
          </div>
        </div>

        {/* Lead Source Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Lead Inflow by Source</h2>
            <p className="text-xs text-slate-400 mt-0.5">Acquisition channels for clinical leads</p>
          </div>

          <div className="py-4 space-y-3">
            {leadSourceData.map((src, i) => {
              const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500'];
              const color = colors[i % colors.length];
              return (
                <div key={src.source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{src.source}</span>
                    <span className="font-semibold text-slate-800">
                      {src.count} ({src.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${src.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Top Performing Channel:</span>
            <span className="font-bold text-indigo-600">Hospital Network & Conferences</span>
          </div>
        </div>
      </div>

      {/* Operational Sections: Recent Contacts, Upcoming Tasks, Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Healthcare Professionals (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Key Healthcare Professionals</h3>
                <p className="text-xs text-slate-400">Recently engaged medical directors and physicians</p>
              </div>
              <button
                onClick={() => navigate('/contacts')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all ({contacts.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('/contacts')}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {c.firstName[0]}
                      {c.lastName[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {c.firstName} {c.lastName}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {c.jobTitle} • {c.organization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        c.status === 'Champion'
                          ? 'bg-indigo-100 text-indigo-800'
                          : c.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Sunshine Act Audit Protocol active</span>
            <span className="text-slate-400">Updated today</span>
          </div>
        </div>

        {/* Right: Upcoming Tasks & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Tasks Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Priority Tasks Due</h3>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all ({tasks.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {upcomingTasks.map((t) => (
                <div key={t.id} className="py-3 flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskComplete(t.id)}
                    className="mt-0.5 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">{t.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="text-rose-600 font-medium">Due {t.dueDate}</span>
                      <span>•</span>
                      <span
                        className={`font-semibold ${
                          t.priority === 'Urgent'
                            ? 'text-rose-600'
                            : t.priority === 'High'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Engagements Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Engagements</h3>
              </div>
              <button
                onClick={() => navigate('/activities')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Timeline
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentActivities.map((a) => (
                <div key={a.id} className="py-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800">{a.relatedName}</span>
                    <span className="text-[10px] text-slate-400">{a.dateTime}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5 font-medium">{a.subject}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                    {a.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
