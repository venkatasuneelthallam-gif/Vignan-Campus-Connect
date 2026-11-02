import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import {
  MapPin,
  Calendar,
  User,
  Wrench,
  Zap,
  Sparkles,
  Building,
  Layers,
  Activity,
  MessageSquare,
  ChevronDown,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight
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

export const ComplaintCard = ({ complaint, onSelect, compact = false }) => {
  const { isAdmin } = useAuth();
  const { updateComplaintStatus, deleteComplaint } = useCampus();
  const [updating, setUpdating] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState(complaint.adminNotes || '');
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  React.useEffect(() => {
    setAdminNoteInput(complaint.adminNotes || '');
  }, [complaint.adminNotes]);

  const Icon = CATEGORY_ICONS[complaint.category] || Activity;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await updateComplaintStatus(complaint._id, newStatus, adminNoteInput);
    setUpdating(false);
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    await updateComplaintStatus(complaint._id, complaint.status, adminNoteInput);
    setShowNoteEditor(false);
    setUpdating(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete complaint "${complaint.title}"?`)) {
      await deleteComplaint(complaint._id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft hover:shadow-soft-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div className="p-5">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {complaint.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Complaint Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
          {complaint.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {complaint.description}
        </p>

        {/* Location & Metadata */}
        <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="font-medium text-slate-700 truncate">{complaint.location}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{complaint.studentName || 'Student'}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Admin Resolution Feedback note if present */}
        {complaint.adminNotes && (
          <div className="mt-3.5 p-3 rounded-lg bg-blue-50/70 border border-blue-100/90 text-xs text-blue-900">
            <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Campus Admin Update</span>
            </div>
            <p className="leading-snug">{complaint.adminNotes}</p>
          </div>
        )}
      </div>

      {/* Admin Fast Management Bar */}
      {isAdmin && (
        <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Change Status:</span>
            <select
              value={complaint.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-semibold rounded-lg bg-white border border-slate-300 py-1 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNoteEditor(!showNoteEditor)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-100/50 transition"
            >
              {complaint.adminNotes ? 'Edit Note' : '+ Add Note'}
            </button>
            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
              title="Delete complaint"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Note Editor Dropdown */}
          {showNoteEditor && (
            <div className="w-full mt-2 pt-2 border-t border-slate-200/80">
              <textarea
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Enter technician update, scheduled fix date, or resolution note..."
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <div className="flex justify-end gap-2 mt-1.5">
                <button
                  onClick={() => setShowNoteEditor(false)}
                  className="text-xs px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={updating}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

