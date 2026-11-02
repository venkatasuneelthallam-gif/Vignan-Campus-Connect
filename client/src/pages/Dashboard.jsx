import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { CampusPulse } from '../components/CampusPulse';
import { ComplaintCard } from '../components/ComplaintCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  User,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Shield,
  Activity,
  Layers,
  Search,
  GraduationCap,
  MapPin
} from 'lucide-react';

export const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const { complaints, stats, loading } = useCampus();
  const [activeTab, setActiveTab] = useState('all'); // 'my' or 'all'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter complaints
  const myComplaints = complaints.filter(
    (c) =>
      c.studentName?.toLowerCase() === currentUser.name?.toLowerCase() ||
      c.studentEmail?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  const displayedComplaints = activeTab === 'my' ? myComplaints : complaints;

  const filteredComplaints = displayedComplaints.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      c.location.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 text-2xl font-bold shadow-soft">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {currentUser.name}!
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 font-semibold uppercase">
                {currentUser.role === 'admin' ? 'VFSTR Dean' : 'VFSTR Student'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>{currentUser.department || 'Computer Science & Engineering (CSE)'}</span>
              <span>•</span>
              <span>{currentUser.studentId ? `Reg: ${currentUser.studentId}` : currentUser.title}</span>
              <span>•</span>
              <span className="text-amber-300">Vadlamudi, Guntur</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/complaints/new"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs shadow-soft transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-blue-700" />
            <span>Report Campus Issue</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-3 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-white hover:bg-indigo-500/50 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Dean Desk</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid: Campus Pulse Analytics + Quick Personal Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Campus Pulse (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-700" />
                <span>Vignan Campus Pulse: Facility Health</span>
              </h2>
              <p className="text-xs text-slate-500">Real-time statistics calculated directly from VFSTR database records</p>
            </div>
          </div>
          <CampusPulse />
        </div>

        {/* Right Column: Key Quick Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-700" />
            <span>Vadlamudi Campus Snapshot</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Resolved Issues
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">
                {stats?.resolvedComplaints ?? 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Across A, V & U Blocks</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Pending Fixes
              </div>
              <div className="text-3xl font-extrabold text-amber-500">
                {stats?.pendingComplaints ?? 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Awaiting dispatch</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                In Progress
              </div>
              <div className="text-3xl font-extrabold text-blue-700">
                {stats?.inProgressComplaints ?? 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Estate crew assigned</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Lost Items Claimed
              </div>
              <div className="text-3xl font-extrabold text-indigo-700">
                {stats?.lostAndFoundStats?.claimed ?? 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Reunited via helpdesk</div>
            </div>
          </div>

          {/* Quick Info Box for university judges */}
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 shadow-soft text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Vignan Exhibition Demonstration Note</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Campus Pulse dynamically aggregates issues reported across Vignan's departments. When an administrator marks a ticket as <span className="text-emerald-400 font-semibold">Resolved</span>, the resolution rate updates instantly without hardcoding!
            </p>
          </div>
        </div>
      </div>

      {/* Complaints Tracking Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Complaints Tracking Feed</h2>
            <p className="text-xs text-slate-500">Monitor issue lifecycle and administration work order updates</p>
          </div>

          {/* Tab Filter Switcher */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Vignan Issues ({complaints.length})
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'my'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Reported ({myComplaints.length})
              </button>
            </div>

            <Link
              to="/complaints/new"
              className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report</span>
            </Link>
          </div>
        </div>

        {/* Search inside dashboard */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search within tickets by title, block or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No complaints matching filter</h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'my'
                ? "You haven't submitted any complaints under this student profile yet."
                : 'Try adjusting your search criteria.'}
            </p>
            {activeTab === 'my' && (
              <Link
                to="/complaints/new"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Submit Your First Complaint
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredComplaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
