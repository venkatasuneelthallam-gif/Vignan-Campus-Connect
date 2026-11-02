import React from 'react';
import { AlertTriangle, AlertCircle, ArrowUpCircle, Check } from 'lucide-react';

export const PriorityBadge = ({ priority = 'Medium' }) => {
  switch (priority) {
    case 'Urgent':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Urgent
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
          <ArrowUpCircle className="w-3 h-3 text-orange-600" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          Low
        </span>
      );
    default:
      return null;
  }
};

