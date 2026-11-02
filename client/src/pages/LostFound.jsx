import React, { useState, useEffect, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import { useAuth } from '../context/AuthContext';
import { LostItemCard } from '../components/LostItemCard';
import {
  Search,
  PlusCircle,
  CheckCircle2,
  Tag,
  Calendar,
  Phone,
  User,
  Filter,
  X,
  Sparkles,
  HelpCircle,
  Inbox,
  GraduationCap
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Books & Stationery',
  'ID Cards & Wallets',
  'Keys',
  'Clothing & Accessories',
  'Other'
];

export const LostFound = () => {
  const { lostItems, refreshAll, submitLostItem, loading } = useCampus();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Lost', 'Found', 'Claimed'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    type: 'Lost',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    contact: currentUser.email || '221fa04108@vignan.ac.in',
    postedBy: currentUser.name || 'Pavan Kumar Reddy'
  });
  const [submitting, setSubmitting] = useState(false);

  // Background sync on mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Instant client-side filtering over full dataset
  const filteredLostItems = useMemo(() => {
    return (lostItems || []).filter((item) => {
      // Tab filter
      if (activeTab === 'Claimed') {
        if (item.status !== 'Claimed') return false;
      } else if (activeTab === 'Lost') {
        if (item.type !== 'Lost' || item.status === 'Claimed') return false;
      } else if (activeTab === 'Found') {
        if (item.type !== 'Found' || item.status === 'Claimed') return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = item.itemName?.toLowerCase().includes(q);
        const matchLoc = item.location?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchContact = item.contact?.toLowerCase().includes(q);
        const matchPoster = item.postedBy?.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchDesc && !matchContact && !matchPoster) {
          return false;
        }
      }

      return true;
    });
  }, [lostItems, activeTab, selectedCategory, searchTerm]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitLostItem(formData);
    setSubmitting(false);

    if (result.success) {
      setModalOpen(false);
      setFormData({
        itemName: '',
        type: 'Lost',
        category: 'Electronics',
        location: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        contact: currentUser.email || '221fa04108@vignan.ac.in',
        postedBy: currentUser.name || 'Pavan Kumar Reddy'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>VFSTR Vadlamudi Campus Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Search className="w-7 h-7 text-indigo-700" />
            <span>Vignan Lost & Found Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Help fellow Vignan students find misplaced ID cards, calculators, cycle keys, and books.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-soft transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Lost or Found Item</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold overflow-x-auto">
            {['All', 'Lost', 'Found', 'Claimed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'All Campus Listings' : tab === 'Lost' ? '🔍 Lost Items' : tab === 'Found' ? '🎁 Found Items' : '✨ Reunited / Claimed'}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items by name, block, description..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-950 text-white'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {filteredLostItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No listings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No items currently listed under this tab or filter.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Post First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLostItems.map((item) => (
            <LostItemCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {/* Post Item Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Report Lost or Found Item at Vignan</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Listing Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Lost' })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                      formData.type === 'Lost'
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🔍 I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Found' })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                      formData.type === 'Found'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🎁 I Found An Item
                  </button>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  required
                  placeholder="e.g. Vignan Student ID Card, Casio fx-991EX Calculator, Cycle Key"
                  value={formData.itemName}
                  onChange={handleFormChange}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="ID Cards & Wallets">ID Cards & Wallets</option>
                    <option value="Keys">Keys</option>
                    <option value="Clothing & Accessories">Clothing & Accessories</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date Noticed
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Location at Vignan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Aryabhata Block 204, Central Library 2nd Floor, Food Court near OAT"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Distinguishing Features <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  placeholder="Color, brand, stickers, serial or registration numbers..."
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Contact & Posted By */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone or Vignan Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    placeholder="e.g. 221fa04108@vignan.ac.in / +91 ..."
                    value={formData.contact}
                    onChange={handleFormChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name / Roll No.
                  </label>
                  <input
                    type="text"
                    name="postedBy"
                    value={formData.postedBy}
                    onChange={handleFormChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-soft disabled:opacity-50"
                >
                  {submitting ? 'Publishing to Board...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
