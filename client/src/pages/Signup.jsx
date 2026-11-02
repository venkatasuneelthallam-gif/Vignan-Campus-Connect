import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology & Pharmacy',
  'Management Studies (MBA)',
  'Sciences & Humanities'
];

export const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useCampus();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    department: 'Computer Science & Engineering (CSE)'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      studentId: role === 'admin' ? 'VIG-STAFF-ADMIN' : formData.studentId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMsg('Please enter your university email address.');
      return;
    }

    let finalEmail = formData.email.trim().toLowerCase();
    if (!finalEmail.includes('@')) {
      finalEmail = `${finalEmail}@vignan.ac.in`;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('You must agree to the Vignan University IT and Facility Terms.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name: formData.name.trim(),
      email: finalEmail,
      password: formData.password,
      role: formData.role,
      studentId: formData.studentId.trim() || (formData.role === 'student' ? '221FA04000' : 'VIG-STAFF'),
      department: formData.department,
      campus: 'VFSTR Vadlamudi, Guntur'
    });
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Account registered successfully! Welcome to VignanConnect.`, 'success');
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message || 'Registration failed. Please try again.');
    }
  };

  // Quick fill sample for live exhibition demo
  const handlePrefillSample = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      name: `Kavya Sri`,
      email: `221fa0${randomNum}@vignan.ac.in`,
      password: 'vignan123',
      confirmPassword: 'vignan123',
      role: 'student',
      studentId: `221FA0${randomNum}`,
      department: 'Computer Science & Engineering (CSE)'
    });
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-slate-100">
      <div className="max-w-lg w-full space-y-6">
        {/* University Header Brand Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200 text-blue-900 text-[11px] font-bold shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>VFSTR Vadlamudi, Guntur (AP)</span>
          </div>

          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900 via-indigo-800 to-blue-600 flex items-center justify-center text-white shadow-soft-lg transform hover:rotate-3 transition">
              <UserPlus className="w-7 h-7 text-amber-300" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your <span className="text-blue-700">VignanConnect</span> Account
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Join the campus community to report issues, track facilities, and recover misplaced belongings.
          </p>
        </div>

        {/* Main Signup Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-6 sm:p-8 space-y-6">
          {/* Role selector tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Campus Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
                  formData.role === 'student'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
                  formData.role === 'admin'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff / Admin</span>
              </button>
            </div>
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kavya Sri / Pavan Kumar"
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Email & Reg ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vignan Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="221fa04xxx@vignan.ac.in"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {formData.role === 'student' ? 'Reg Number' : 'Staff ID'}
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder={formData.role === 'student' ? 'e.g. 221FA04108' : 'e.g. VIG-STAFF-102'}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department / Faculty
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-8 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="cursor-pointer text-[11px] leading-tight text-slate-500">
                I agree to adhere to the{' '}
                <span className="font-semibold text-slate-800">VFSTR Vadlamudi Campus IT & Discipline Guidelines</span>{' '}
                when reporting issues.
              </label>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create VignanConnect Account</span>
                </>
              )}
            </button>
          </form>

          {/* Exhibition Quick Prefill Pill */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Exhibition shortcut:</span>
            <button
              type="button"
              onClick={handlePrefillSample}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Autofill Sample Student</span>
            </button>
          </div>

          {/* Footer switch to Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already registered on VignanConnect?{' '}
              <Link to="/login" className="font-bold text-blue-700 hover:text-blue-800 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

