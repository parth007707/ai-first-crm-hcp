import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  DollarSign,
  Users,
  Target,
  FileText
} from 'lucide-react';
import { DealStage } from '../types/crm';

export const ReportsPage: React.FC = () => {
  const { deals, leads, contacts, activities, tasks, addToast } = useCRM();
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y'>('30d');

  // Computed metrics
  const totalPipeline = deals
    .filter((d) => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const weightedPipeline = deals
    .filter((d) => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value * (d.probability / 100), 0);

  const closedWonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const closedWonRevenue = closedWonDeals.reduce((sum, d) => sum + d.value, 0);

  // Activity breakdown
  const activityCounts: Record<string, number> = {};
  activities.forEach((a) => {
    activityCounts[a.type] = (activityCounts[a.type] || 0) + 1;
  });

  // Deal Stage Breakdown
  const stages: DealStage[] = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const stageStats = stages.map((s) => {
    const stageDeals = deals.filter((d) => d.stage === s);
    const sumVal = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      stage: s,
      count: stageDeals.length,
      value: sumVal,
    };
  });
  const maxVal = Math.max(...stageStats.map((s) => s.value), 1);

  // Lead Conversion Stats
  const totalLeads = leads.length || 1;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const overallConversion = Math.round((convertedLeads / totalLeads) * 100);

  // Export CSV Handler
  const handleExportCsv = () => {
    const rows = [
      ['Deal ID', 'Deal Name', 'Organization', 'Contact', 'Value', 'Stage', 'Probability', 'Close Date'],
      ...deals.map((d) => [
        d.id,
        `"${d.dealName}"`,
        `"${d.organization}"`,
        `"${d.contactName}"`,
        d.value,
        d.stage,
        `${d.probability}%`,
        d.expectedCloseDate,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `healthpulse-crm-analytics-${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Report Exported', 'Analytics CSV downloaded successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales & Clinical Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Revenue forecasts, pipeline velocity, and physician engagement distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90 Days)</option>
            <option value="1y">Year to Date (YTD)</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pipeline Value</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ${totalPipeline.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across {deals.length} tracked opportunities</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Weighted Forecast</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            ${Math.round(weightedPipeline).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Probability-adjusted closing target</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Closed Won Revenue</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ${closedWonRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Realized clinical contracts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lead Conversion Rate</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">{overallConversion}%</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {convertedLeads} converted of {totalLeads} total leads
          </p>
        </div>
      </div>

      {/* Pipeline Stage Valuation Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pipeline Stage Distribution</h3>
              <p className="text-xs text-slate-400">Volume and contract value progression</p>
            </div>
          </div>

          <div className="space-y-4 py-5">
            {stageStats.map((item) => {
              const pct = Math.round((item.value / maxVal) * 100);
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {item.stage} ({item.count} deals)
                    </span>
                    <span className="font-bold text-slate-900">${item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.stage === 'Closed Won'
                          ? 'bg-emerald-500'
                          : item.stage === 'Negotiation'
                          ? 'bg-indigo-600'
                          : 'bg-indigo-400'
                      }`}
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Physician Interactions</h3>
            <p className="text-xs text-slate-400">Engagement channels utilized by field team</p>
          </div>

          <div className="space-y-3 py-4">
            {Object.entries(activityCounts).map(([type, count]) => {
              const pct = Math.round((count / (activities.length || 1)) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{type}</span>
                    <span className="font-bold text-slate-900">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
            High correlation observed between <strong>In-Person Clinical Meetings</strong> and deal closing velocity.
          </div>
        </div>
      </div>

      {/* Top 5 High-Impact Deals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Top Revenue Clinical Contracts</h3>
          <p className="text-xs text-slate-400">Ranked by overall deal volume and close probability</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Opportunity</th>
                <th className="px-5 py-3.5">Hospital / Account</th>
                <th className="px-5 py-3.5">Value ($)</th>
                <th className="px-5 py-3.5">Stage</th>
                <th className="px-5 py-3.5">Probability</th>
                <th className="px-5 py-3.5">Target Close</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...deals]
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{d.dealName}</td>
                    <td className="px-5 py-3.5 text-slate-700">{d.organization}</td>
                    <td className="px-5 py-3.5 font-bold text-indigo-700">${d.value.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {d.stage}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{d.probability}%</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{d.expectedCloseDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
