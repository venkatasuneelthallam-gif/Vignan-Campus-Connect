import React from 'react';
import { Clock, Loader2, CheckCircle, Sparkles } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-semibold',
    lg: 'text-sm px-4 py-1.5 font-semibold'
  };

  switch (status) {
    case 'Pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          Pending
        </span>
      );

    case 'In Progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          In Progress
        </span>
      );

    case 'Resolved':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Resolved
        </span>
      );

    case 'Active':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          Active
        </span>
      );

    case 'Claimed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Claimed
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
};

