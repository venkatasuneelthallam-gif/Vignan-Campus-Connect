import React from 'react';
import { useCampus } from '../context/CampusContext';
import { computePulseStats } from '../data/vignanSeed';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Zap,
  Sparkles,
  Building,
  Layers,
  GraduationCap
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Electrical': Zap,
  'Cleaning & Washrooms': Sparkles,
  'Classroom & Furniture': Building,
  'IT & AV Equipment': Layers,
  'Hostel & Mess': Building,
  'Campus Infrastructure': Wrench,
  'Other': Activity,
};

export const CampusPulse = ({ compact = false }) => {
  const { stats, complaints, lostItems, backendConnected } = useCampus();

  // Always compute safe, stable stats so the component NEVER blinks or disappears
  const displayStats =
    stats && stats.totalComplaints !== undefined
      ? stats
      : computePulseStats(complaints || [], lostItems || [], backendConnected);

  const {
    totalComplaints = 0,
    pendingComplaints = 0,
    inProgressComplaints = 0,
    resolvedComplaints = 0,
    resolutionRate = 0,
    topCategories = [],
    databaseMode
  } = displayStats;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden transition-all duration-200 hover:shadow-soft-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300">
              <Activity className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white">Vignan Campus Pulse</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                  VFSTR Live Analytics
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Live telemetry from Aryabhata, Visvesvaraya, U-Block & Hostels
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-white flex items-center justify-end gap-1">
              <span className="text-emerald-400">{resolutionRate}%</span>
              <span className="text-xs font-normal text-blue-200">resolved</span>
            </div>
            <p className="text-[11px] text-blue-300/70">
              {resolvedComplaints} of {totalComplaints} campus issues resolved
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Metric strip */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-center">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Attention</div>
            <div className="text-xl font-bold text-amber-600 mt-0.5">{pendingComplaints}</div>
          </div>
          <div className="border-x border-slate-200">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">In Progress</div>
            <div className="text-xl font-bold text-blue-700 mt-0.5">{inProgressComplaints}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Resolved</div>
            <div className="text-xl font-bold text-emerald-600 mt-0.5">{resolvedComplaints}</div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
            <span>Overall Vadlamudi Campus Maintenance Velocity</span>
            <span className="font-semibold text-slate-900">{resolutionRate}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/70">
            <div
              className="bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${(resolvedComplaints / (totalComplaints || 1)) * 100}%` }}
              title={`Resolved: ${resolvedComplaints}`}
            />
            <div
              className="bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(inProgressComplaints / (totalComplaints || 1)) * 100}%` }}
              title={`In Progress: ${inProgressComplaints}`}
            />
            <div
              className="bg-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${(pendingComplaints / (totalComplaints || 1)) * 100}%` }}
              title={`Pending: ${pendingComplaints}`}
            />
          </div>
          <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> In Progress
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pending
            </span>
          </div>
        </div>

        {/* Most Frequently Reported Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
            <span>Most Frequently Reported Problem Categories at Vignan</span>
            <span className="text-[11px] font-normal text-slate-500 lowercase">dynamic rankings</span>
          </h4>

          {topCategories.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No category data yet.</p>
          ) : (
            <div className="space-y-3.5">
              {topCategories.map((cat, idx) => {
                const IconComponent = CATEGORY_ICONS[cat.category] || Activity;
                const catResolutionRate = cat.total > 0 ? Math.round((cat.resolved / cat.total) * 100) : 0;

                return (
                  <div key={cat.category} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center space-x-2 font-medium text-slate-800">
                        <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                          <IconComponent className="w-3.5 h-3.5" />
                        </span>
                        <span>{cat.category}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500">
                        <span className="font-semibold text-slate-700">{cat.total} issues</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-600 font-medium">{catResolutionRate}% fixed</span>
                      </div>
                    </div>
                    {/* Category Frequency Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? 'bg-gradient-to-r from-blue-700 to-indigo-600'
                            : idx === 1
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500'
                            : 'bg-gradient-to-r from-slate-400 to-slate-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(12, cat.percentage * 2.2))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Database mode footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Database Engine: {databaseMode || 'MongoDB (Mongoose)'}</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active Sync
          </span>
        </div>
      </div>
    </div>
  );
};
