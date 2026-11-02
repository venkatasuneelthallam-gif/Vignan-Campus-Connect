import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  FileText,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Zap,
  Building,
  Layers,
  Wrench,
  Activity,
  Send,
  Eye,
  GraduationCap
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Electrical', label: 'Electrical', icon: Zap, desc: 'Fans, lights, wiring, switches' },
  { id: 'Cleaning & Washrooms', label: 'Cleaning & Washrooms', icon: Sparkles, desc: 'Plumbing, leaks, hygiene, trash' },
  { id: 'Classroom & Furniture', label: 'Classroom & Furniture', icon: Building, desc: 'Desks, benches, podiums, boards' },
  { id: 'IT & AV Equipment', label: 'IT & AV Equipment', icon: Layers, desc: 'Projectors, CCF Wi-Fi, lab PCs' },
  { id: 'Hostel & Mess', label: 'Hostel & Mess', icon: Building, desc: 'Vasishta/Priyamvada hostels, RO coolers' },
  { id: 'Campus Infrastructure', label: 'Campus Infrastructure', icon: Wrench, desc: 'OAT, walkways, cycle parking, gates' },
  { id: 'Other', label: 'Other', icon: Activity, desc: 'General campus issues' },
];

const VIGNAN_LOCATIONS = [
  'Aryabhata Block (A-Block), Room 208',
  'Visvesvaraya Block (V-Block), Room 304',
  'U-Block (CCF Computing Lab)',
  'Dr. K. L. Rao Central Library',
  'NTR Vignan Vihar (Main Admin Block)',
  'Open Air Theatre (OAT) & Cafeteria',
  'Vasishta Boys Hostel',
  'Priyamvada Girls Hostel',
  'H-Block (Biotechnology & Pharmacy)'
];

export const ComplaintNew = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { submitComplaint } = useCampus();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electrical',
    location: '',
    description: '',
    priority: 'Medium',
    studentName: currentUser.name || 'Pavan Kumar Reddy',
    studentEmail: currentUser.email || '221fa04108@vignan.ac.in'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep student identity in sync with role switcher
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      studentName: currentUser.name || 'Pavan Kumar Reddy',
      studentEmail: currentUser.email || '221fa04108@vignan.ac.in'
    }));
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleCategorySelect = (catId) => {
    setFormData({ ...formData, category: catId });
  };

  const handleQuickLocation = (loc) => {
    setFormData({ ...formData, location: loc });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      setErrorMsg('Please fill out all mandatory fields: Title, Location, and Description.');
      return;
    }

    setSubmitting(true);
    const result = await submitComplaint(formData);
    setSubmitting(false);

    if (result.success) {
      navigate('/complaints');
    } else {
      setErrorMsg(result.message || 'Error creating complaint');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Complaints Directory</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 sm:p-8">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>VFSTR Vadlamudi Campus Facilities</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-700" />
              <span>Report Campus Issue</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit a maintenance request directly to the Vignan University Estate & CCF teams.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Projector Lamp Failure / Fan Screeching / Water Cooler Sensor Fault"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>

            {/* Category Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Problem Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-700 bg-blue-50/80 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                          {cat.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location & Quick chips */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Exact Campus Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative mb-2">
                <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Aryabhata Block Room 204 or Visvesvaraya Block 304"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>

              {/* Quick location chips for Vignan */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Quick Pick:</span>
                {VIGNAN_LOCATIONS.slice(0, 5).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleQuickLocation(loc)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition"
                  >
                    {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Urgency / Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              >
                <option value="Low">Low - Cosmetic or non-urgent</option>
                <option value="Medium">Medium - Regular classroom / lab fix</option>
                <option value="High">High - Directly impacts faculty lectures</option>
                <option value="Urgent">Urgent - Safety, water leakage or electrical hazard</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Issue Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what is broken, which equipment is impacted, or how long it has been faulty..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 leading-relaxed"
              />
            </div>

            {/* Reporter details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-600 block mb-0.5">Reported By:</span>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-600 block mb-0.5">Vignan Email:</span>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Notifying Vignan Estate Team...' : 'Submit Campus Complaint'}</span>
            </button>
          </form>
        </div>

        {/* Live Ticket Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Eye className="w-4 h-4 text-blue-700" />
            <span>Live Card Preview</span>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200/90 shadow-soft-lg p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-700 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider">
              VIGNAN PREVIEW
            </div>

            <div className="flex items-start justify-between gap-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
                {formData.category}
              </span>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={formData.priority} />
                <StatusBadge status="Pending" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {formData.title.trim() || 'Ceiling Fan Screeching in Aryabhata Block 208'}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {formData.description.trim() || 'Detailed problem explanation will show here once you enter it in the form...'}
            </p>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{formData.location.trim() || 'Aryabhata Block (A-Block), Room 208'}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Reported by {formData.studentName || 'Student'} • Just now
              </div>
            </div>
          </div>

          {/* Exhibition Quick tip */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Exhibition Demonstration Tip</span>
            </div>
            <p className="text-blue-950 leading-relaxed text-[11px]">
              Submitting registers this ticket in the Vignan database under status <span className="font-semibold text-amber-700">Pending</span>. Switch the navbar persona to <span className="font-semibold text-blue-900">Dr. K. V. Krishna Kishore (Dean)</span> to simulate administrative approval and resolution!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
