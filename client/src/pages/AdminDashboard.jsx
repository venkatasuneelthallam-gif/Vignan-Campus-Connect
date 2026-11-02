import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  Send,
  MessageSquare,
  Lock,
  Layers,
  ArrowRight,
  GraduationCap,
  LogIn
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, isAdmin, switchRole } = useAuth();
  const {
    complaints,
    announcements,
    stats,
    updateComplaintStatus,
    deleteComplaint,
    submitAnnouncement,
    deleteAnnouncement,
    resetDemoData
  } = useCampus();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Announcement composer state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState('General');
  const [announcementPriority, setAnnouncementPriority] = useState('Normal');
  const [publishing, setPublishing] = useState(false);

  // If not admin, show friendly barrier with 1-click unlock for the university presentation
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-soft-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              VFSTR Vadlamudi, Guntur
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dean & Estate Administration Area
            </h2>
          </div>

          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            You are currently viewing as <span className="font-semibold text-slate-900">{currentUser.name}</span> (Student). Access to update complaint status and broadcast official Vignan campus notices is restricted to authorized administrative personnel.
          </p>

          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 max-w-md mx-auto text-left">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-blue-800">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>Vignan Project Exhibition Shortcut</span>
            </div>
            Switch to the Dean / Administrator persona with one click to demonstrate ticket management and status transitions to the evaluation committee.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => switchRole('admin')}
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-soft transition inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Switch to Dr. K. V. Krishna Kishore (Dean View)</span>
            </button>

            <Link
              to="/login"
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition inline-flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Sign In with Admin Credentials</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    if (!matchesStatus) return false;
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(s) ||
      c.location.toLowerCase().includes(s) ||
      c.category.toLowerCase().includes(s) ||
      (c.studentName && c.studentName.toLowerCase().includes(s))
    );
  });

  const handleStatusChange = async (id, newStatus, existingNotes) => {
    await updateComplaintStatus(id, newStatus, existingNotes);
  };

  const handleSaveNote = async (id, currentStatus) => {
    await updateComplaintStatus(id, currentStatus, noteText);
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    setPublishing(true);
    const res = await submitAnnouncement({
      title: announcementTitle,
      message: announcementMsg,
      category: announcementCategory,
      priority: announcementPriority,
      postedBy: currentUser.title || 'Dean of Student Affairs - VFSTR'
    });
    setPublishing(false);

    if (res.success) {
      setAnnouncementTitle('');
      setAnnouncementMsg('');
      setAnnouncementCategory('General');
      setAnnouncementPriority('Normal');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300">
              <GraduationCap className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              VFSTR Vadlamudi • Estate & Facilities Command Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Vignan Facilities & Student Affairs Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Logged in as <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.title || 'Dean, Student Affairs & Estate Operations'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoData}
            className="px-4 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/60 text-xs font-semibold flex items-center gap-2 transition"
            title="Reset database to initial Vignan University demo state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Vignan Demo Data</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{stats?.totalComplaints ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Received all-time</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Attention</div>
          <div className="text-3xl font-black text-amber-500 mt-1">{stats?.pendingComplaints ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting dispatch</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">In Progress</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{stats?.inProgressComplaints ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Technicians on site</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats?.resolvedComplaints ?? 0}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">{stats?.resolutionRate ?? 0}% fix velocity</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Lost & Found</div>
          <div className="text-3xl font-black text-indigo-700 mt-1">{stats?.lostAndFoundStats?.total ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">{stats?.lostAndFoundStats?.claimed ?? 0} claimed</div>
        </div>
      </div>

      {/* Complaints Management Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-700" />
              <span>Campus Complaints Triage & Resolution Table</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Change complaint statuses in real-time to update the live Vignan Campus Pulse
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition ${
                    statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by title, block or roll..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Complaint Details</th>
                <th className="py-3.5 px-4">Campus Location</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Urgency</th>
                <th className="py-3.5 px-6">Status (Live Update)</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No complaints matching active filter.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Complaint Details */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{c.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.description}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {c.category}
                        </span>
                        {c.adminNotes && (
                          <span className="text-[10px] text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <MessageSquare className="w-2.5 h-2.5 text-blue-700" /> Note attached
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                      {c.location}
                    </td>

                    {/* Student */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                      <div className="font-medium text-slate-800">{c.studentName || 'Student'}</div>
                      <div className="text-[10px] text-slate-400">{c.studentEmail}</div>
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value, c.adminNotes)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : c.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="In Progress">🔄 In Progress</option>
                        <option value="Resolved">✅ Resolved</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (editingNoteId === c._id) {
                              setEditingNoteId(null);
                            } else {
                              setEditingNoteId(c._id);
                              setNoteText(c.adminNotes || '');
                            }
                          }}
                          className="text-xs text-blue-700 hover:text-blue-900 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition"
                        >
                          {editingNoteId === c._id ? 'Close' : c.adminNotes ? 'Edit Note' : '+ Note'}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete complaint "${c.title}"?`)) {
                              deleteComplaint(c._id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                          title="Delete complaint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Note editor row expansion */}
                      {editingNoteId === c._id && (
                        <div className="mt-2 p-2.5 bg-blue-50/80 rounded-xl border border-blue-200">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Type resolution update / technician dispatch notes..."
                            className="w-full text-xs p-2 rounded-lg border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />
                          <div className="flex justify-end gap-1.5 mt-1.5">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="text-[11px] px-2 py-1 text-slate-500 hover:bg-slate-200 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(c._id, c.status)}
                              className="text-[11px] px-2.5 py-1 bg-blue-700 text-white rounded font-bold hover:bg-blue-800"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements Manager Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Post Announcement Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-700" />
              <span>Broadcast Vignan Official Notice</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish university notices on Mahotsav, examinations, or facilities
            </p>
          </div>

          <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notice Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. Mahotsav 2026 Booth Allotment / Library Extended Hours"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={announcementCategory}
                  onChange={(e) => setAnnouncementCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                >
                  <option value="General">General</option>
                  <option value="Events">Events (Mahotsav / Inno-Fest)</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Academic">Academic (Midterms/Labs)</option>
                  <option value="Urgent Alert">Urgent Alert (Bus/Advisory)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={announcementPriority}
                  onChange={(e) => setAnnouncementPriority(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Critical">Critical Alert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notice Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                placeholder="Detailed announcement text..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{publishing ? 'Publishing...' : 'Broadcast Campus Notice'}</span>
            </button>
          </form>
        </div>

        {/* Existing Announcements List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Vignan Notices</h2>
              <p className="text-xs text-slate-500">Currently visible to all students across Vadlamudi campus</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {announcements.length} Published
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No active announcements.</p>
            ) : (
              announcements.map((a) => (
                <div
                  key={a._id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 hover:border-slate-300 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {a.category}
                      </span>
                      {a.priority !== 'Normal' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {a.priority}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{a.message}</p>
                    <div className="text-[10px] text-slate-400">
                      Posted by {a.postedBy} • {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete announcement "${a.title}"?`)) {
                        deleteAnnouncement(a._id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
