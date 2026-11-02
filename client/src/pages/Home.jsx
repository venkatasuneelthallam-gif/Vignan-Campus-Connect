import React from 'react';
import { Link } from 'react-router-dom';
import { useCampus } from '../context/CampusContext';
import { CampusPulse } from '../components/CampusPulse';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { ComplaintCard } from '../components/ComplaintCard';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Building,
  Bell,
  HeartHandshake,
  MapPin,
  GraduationCap
} from 'lucide-react';

export const Home = () => {
  const { complaints, announcements, stats, loading } = useCampus();

  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 2);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-900 text-xs font-bold mb-6 shadow-xs animate-bounce-subtle">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>Vignan's Foundation for Science, Technology & Research (VFSTR) • Vadlamudi, Guntur</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              One Unified Portal for Vignan Campus{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600">
                Issues, Lost Items & Bulletins
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Empowering students and estate administrators across Aryabhata Block, Visvesvaraya Block, U-Block, and Vignan Hostels to report maintenance faults, recover lost belongings, and track resolutions live.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <Link
                to="/complaints/new"
                className="px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-soft-lg hover:shadow-glow transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Report Campus Fault</span>
              </Link>

              <Link
                to="/lost-found"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-soft transition-all hover:border-blue-400 flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Vignan Lost & Found</span>
              </Link>

              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-sm transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>View Campus Pulse</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats?.totalComplaints ?? '...'}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus Tickets</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{stats?.resolutionRate ?? '...'}%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolution Rate</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats?.pendingComplaints ?? '...'}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Attention</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats?.lostAndFoundStats?.total ?? '...'}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lost & Recovered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Campus Pulse & Latest Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Campus Pulse (7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Vignan University Facility Pulse</span>
                  <span className="text-xs font-normal text-slate-500">Vadlamudi Campus</span>
                </h2>
                <p className="text-xs text-slate-500">Live dynamic analytics computed directly from MongoDB database records</p>
              </div>
              <Link to="/dashboard" className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                Full Analytics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <CampusPulse />
          </div>

          {/* Right Column: Campus Bulletins & Announcements (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vignan Official Notices</h2>
                <p className="text-xs text-slate-500">VFSTR Administration & Dean Office broadcasts</p>
              </div>
              <Link to="/admin" className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                Post Notice <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentAnnouncements.map((ann) => (
                <AnnouncementCard key={ann._id} announcement={ann} />
              ))}
            </div>

            {/* Quick action card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 text-white shadow-soft">
              <div className="flex items-center gap-2 mb-1">
                <Search className="w-4 h-4 text-cyan-300" />
                <h3 className="font-bold text-base">Misplaced Belongings on Campus?</h3>
              </div>
              <p className="text-xs text-blue-200/90 mb-4 leading-relaxed">
                Check whether your student ID card, scientific calculator, or cycle keys have been turned into Vignan Security or Central Library helpdesk.
              </p>
              <Link
                to="/lost-found"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-white text-blue-950 rounded-lg hover:bg-blue-50 transition"
              >
                Search Lost & Found <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Project Features Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            Built for Vignan University Exhibition
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Streamlining Vadlamudi Campus Operations
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            The six pillars powering CampusConnect for student convenience and swift administrative triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">1. Fault Reporting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log tickets specifying Aryabhata Block, Visvesvaraya Block, U-Block, Central Library, or Hostels with priority.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">2. Live Status Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent Pending, In Progress, and Resolved status transitions with real-time technician feedback notes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">3. Lost & Found Board</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reclaim missing ID cards, lab aprons, calculators, or keys, and mark items claimed with 1-click.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">4. Central Announcements</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminate WhatsApp confusion with verified administrative notices on Mahotsav, bus schedules, and exam hours.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">5. Dean & Admin Desk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized desk for Dean of Student Affairs & Estate team to update work orders and publish advisories.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">6. Dynamic Campus Pulse</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live mathematical breakdown of fault frequencies and resolution rates calculated straight from database records.
            </p>
          </div>
        </div>
      </section>

      {/* Recently Resolved Showcase */}
      {resolvedComplaints.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recently Resolved Issues at Vignan
              </h2>
              <p className="text-xs text-slate-500">Repairs completed by the Vadlamudi Estate & CCF teams</p>
            </div>
            <Link to="/complaints" className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
              View All Complaints <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resolvedComplaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
