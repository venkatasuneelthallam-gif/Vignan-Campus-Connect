import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCampus } from '../context/CampusContext';
import { ComplaintCard } from '../components/ComplaintCard';
import {
  FileText,
  Search,
  PlusCircle,
  Filter,
  CheckCircle2,
  Clock,
  Loader2,
  SlidersHorizontal,
  RefreshCw,
  X
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electrical',
  'Cleaning & Washrooms',
  'Classroom & Furniture',
  'IT & AV Equipment',
  'Hostel & Mess',
  'Campus Infrastructure',
  'Other'
];

const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved'];

export const Complaints = () => {
  const { complaints, refreshAll, loading } = useCampus();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Refresh in background on mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Instant client-side filtering over the complete complaints dataset
  const filteredComplaints = useMemo(() => {
    return (complaints || [])
      .filter((c) => {
        // Status filter
        if (selectedStatus !== 'All' && c.status !== selectedStatus) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'All' && c.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = c.title?.toLowerCase().includes(q);
          const matchLoc = c.location?.toLowerCase().includes(q);
          const matchDesc = c.description?.toLowerCase().includes(q);
          const matchCat = c.category?.toLowerCase().includes(q);
          const matchStudent = c.studentName?.toLowerCase().includes(q);
          if (!matchTitle && !matchLoc && !matchDesc && !matchCat && !matchStudent) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return sortBy === 'oldest' ? timeA - timeB : timeB - timeA;
      });
  }, [complaints, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || selectedStatus !== 'All' || sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <span>VFSTR Vadlamudi Campus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-blue-700" />
            <span>Vignan Complaints Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, and monitor student reports across Aryabhata Block, Visvesvaraya Block, U-Block, and Vignan Hostels.
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-soft transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by fault title, room/block location, or description..."
              className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {STATUSES.map((status) => {
            const active = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold ml-auto transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No complaints found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No complaints match your active filter criteria. Try clearing filters or submit a new report.
          </p>
          <div className="flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Clear Filters
              </button>
            )}
            <Link
              to="/complaints/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Submit New Complaint
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
};

