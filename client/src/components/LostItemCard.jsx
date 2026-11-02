import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import {
  MapPin,
  Calendar,
  Phone,
  User,
  Tag,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Search,
  ExternalLink
} from 'lucide-react';

export const LostItemCard = ({ item }) => {
  const { isAdmin, currentUser } = useAuth();
  const { updateLostItemStatus, deleteLostItem } = useCampus();
  const [showContact, setShowContact] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isLost = item.type === 'Lost';
  const isClaimed = item.status === 'Claimed' || item.status === 'Resolved';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClaim = async () => {
    setUpdating(true);
    await updateLostItemStatus(item._id, 'Claimed');
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete listing for "${item.itemName}"?`)) {
      await deleteLostItem(item._id);
    }
  };

  return (
    <div className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
      isClaimed ? 'border-slate-200 opacity-75' : 'border-slate-200/90 shadow-soft hover:shadow-soft-lg'
    }`}>
      <div className="p-5">
        {/* Type & Status Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isLost
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isLost ? <Search className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>

          <StatusBadge status={item.status} />
        </div>

        {/* Item Title */}
        <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
          {item.itemName}
        </h3>

        {/* Category tag */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <Tag className="w-3 h-3 text-slate-400" />
          <span>{item.category || 'General'}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Location & Date */}
        <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-800 truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(item.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <User className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{item.postedBy}</span>
            </div>
          </div>
        </div>

        {/* Contact Reveal Box */}
        {showContact ? (
          <div className="mt-4 p-3 bg-blue-50/80 rounded-lg border border-blue-100 text-xs text-blue-900 animate-fadeIn">
            <div className="font-semibold text-blue-950 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact Information</span>
            </div>
            <div className="font-mono text-xs bg-white/80 p-2 rounded border border-blue-200/60 select-all">
              {item.contact}
            </div>
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowContact(!showContact)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition py-1"
        >
          {showContact ? 'Hide Contact' : 'Show Contact Details'}
        </button>

        <div className="flex items-center gap-2">
          {!isClaimed && (
            <button
              onClick={handleClaim}
              disabled={updating}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Claimed
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleDelete}
              className="p-1 text-slate-400 hover:text-rose-600 transition"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

