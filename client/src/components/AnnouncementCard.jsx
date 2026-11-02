import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { Bell, AlertTriangle, Calendar, User, Trash2, Megaphone } from 'lucide-react';

export const AnnouncementCard = ({ announcement }) => {
  const { isAdmin } = useAuth();
  const { deleteAnnouncement } = useCampus();

  const isCritical = announcement.priority === 'Critical';
  const isImportant = announcement.priority === 'Important';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete announcement "${announcement.title}"?`)) {
      await deleteAnnouncement(announcement._id);
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isCritical
          ? 'bg-rose-50/50 border-rose-300 shadow-soft'
          : isImportant
          ? 'bg-amber-50/40 border-amber-300 shadow-soft'
          : 'bg-white border-slate-200/90 shadow-soft'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isCritical
                  ? 'bg-rose-100 text-rose-700'
                  : isImportant
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isCritical
                  ? 'bg-rose-100 text-rose-800'
                  : isImportant
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {announcement.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCritical && (
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Urgent Notice
              </span>
            )}
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="text-slate-400 hover:text-rose-600 transition p-1"
                title="Delete announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">
          {announcement.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {announcement.message}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{announcement.postedBy || 'Campus Administration'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(announcement.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

