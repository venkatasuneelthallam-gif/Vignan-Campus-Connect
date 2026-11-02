import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { User, ShieldCheck, Check, Sparkles, X, RefreshCw, GraduationCap, LogIn, UserPlus } from 'lucide-react';

export const RoleSwitcherModal = ({ isOpen, onClose }) => {
  const { currentUser, switchRole, loginCustom } = useAuth();
  const { resetDemoData } = useCampus();
  const [customMode, setCustomMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    loginCustom(name, email, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base leading-tight">Vignan University Exhibition Demo</h3>
              <p className="text-[10px] text-blue-200">VFSTR Vadlamudi, Guntur • Persona Switcher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Switch identities instantly during your project exhibition to demonstrate student complaint submissions vs. administrative status triage at Vignan University.
          </p>

          {!customMode ? (
            <div className="space-y-3">
              {/* Option 1: Vignan Student */}
              <button
                type="button"
                onClick={() => {
                  switchRole('student');
                  onClose();
                }}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  currentUser.role === 'student'
                    ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-xs">
                    PK
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      Pavan Kumar Reddy
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                        Student
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">Reg: 221FA04108 • CSE Dept</div>
                    <div className="text-[11px] text-slate-400">Can report issues & browse lost items</div>
                  </div>
                </div>
                {currentUser.role === 'student' && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </button>

              {/* Option 2: Vignan Admin / Dean */}
              <button
                type="button"
                onClick={() => {
                  switchRole('admin');
                  onClose();
                }}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  currentUser.role === 'admin'
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      Dr. K. V. Krishna Kishore
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                        Dean
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">Dean, Student Affairs & Estate Operations</div>
                    <div className="text-[11px] text-slate-400">Can update complaint status & post notices</div>
                  </div>
                </div>
                {currentUser.role === 'admin' && (
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                )}
              </button>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCustomMode(true)}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Enter custom Vignan roll no.
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await resetDemoData();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition"
                  title="Reseed database with fresh Vignan University demo records"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Vignan Demo Data
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Student/Faculty Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sai Teja / Prof. Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vignan Email or Roll No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 231fa04001@vignan.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="student">Student (B.Tech / M.Tech / Pharmacy)</option>
                  <option value="admin">Campus Administrator (Dean / Estate Officer)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="text-xs px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Set Active Profile
                </button>
              </div>
            </form>
          )}

          {/* Full Page Navigation Links */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              to="/login"
              onClick={onClose}
              className="text-blue-700 hover:text-blue-800 hover:underline font-bold flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Dedicated Login Page</span>
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
