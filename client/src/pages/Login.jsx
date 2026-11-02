import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useCampus();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleTab, setRoleTab] = useState('student'); // 'student' or 'admin'
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Return url if redirected from protected route
  const from = location.state?.from?.pathname || '/dashboard';

  const handleRoleTabChange = (role) => {
    setRoleTab(role);
    setErrorMsg('');
    if (role === 'student') {
      setEmail('221fa04108@vignan.ac.in');
      setPassword('vignan123');
    } else {
      setEmail('dean.affairs@vignan.ac.in');
      setPassword('dean123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user?.name || 'User'}!`, 'success');
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.message || 'Login failed. Please check your credentials.');
    }
  };

  // 1-Click quick fill demo handlers
  const handleQuickDemoStudent = async () => {
    setEmail(DEMO_USERS.student.email);
    setPassword(DEMO_USERS.student.password);
    setRoleTab('student');
    setIsSubmitting(true);
    const result = await login(DEMO_USERS.student.email, DEMO_USERS.student.password);
    setIsSubmitting(false);
    if (result.success) {
      showToast('Logged in as Vignan Student: Pavan Kumar Reddy', 'success');
      navigate('/dashboard');
    }
  };

  const handleQuickDemoDean = async () => {
    setEmail(DEMO_USERS.admin.email);
    setPassword(DEMO_USERS.admin.password);
    setRoleTab('admin');
    setIsSubmitting(true);
    const result = await login(DEMO_USERS.admin.email, DEMO_USERS.admin.password);
    setIsSubmitting(false);
    if (result.success) {
      showToast('Logged in as VFSTR Dean: Dr. K. V. Krishna Kishore', 'success');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-slate-100">
      <div className="max-w-md w-full space-y-6">
        {/* University Header Brand Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200 text-blue-900 text-[11px] font-bold shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>VFSTR Vadlamudi, Guntur (AP)</span>
          </div>

          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900 via-indigo-800 to-blue-600 flex items-center justify-center text-white shadow-soft-lg transform hover:rotate-3 transition">
              <GraduationCap className="w-8 h-8 text-amber-300" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to <span className="text-blue-700">VignanConnect</span>
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Centralized portal for students and administrators across Aryabhata, Visvesvaraya, U-Block & Hostels
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-6 sm:p-8 space-y-6">
          {/* Persona selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleTabChange('student')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
                roleTab === 'student'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
                roleTab === 'admin'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dean / Admin</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vignan Email / Reg ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleTab === 'student' ? '221fa04108@vignan.ac.in' : 'dean.affairs@vignan.ac.in'}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me on this laptop</span>
              </label>
              <span className="text-[11px] text-slate-400">VFSTR Security</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-xs shadow-soft transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as {roleTab === 'student' ? 'Student' : 'Dean / Admin'}</span>
                </>
              )}
            </button>
          </form>

          {/* Exhibition Quick Access Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Exhibition Quick-Fill Credentials</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleQuickDemoStudent}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-left transition text-blue-900 group"
              >
                <div className="text-[11px] font-bold flex items-center justify-between">
                  <span>Student Persona</span>
                  <ArrowRight className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-blue-600/80 font-medium">Pavan Kumar (CSE)</div>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoDean}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-left transition text-indigo-900 group"
              >
                <div className="text-[11px] font-bold flex items-center justify-between">
                  <span>Dean Persona</span>
                  <ArrowRight className="w-3 h-3 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-indigo-600/80 font-medium">Dr. Krishna Kishore</div>
              </button>
            </div>
          </div>

          {/* Footer switch to Signup */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              New to VignanConnect?{' '}
              <Link to="/signup" className="font-bold text-blue-700 hover:text-blue-800 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

