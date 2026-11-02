import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import {
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  User,
  Menu,
  X,
  Compass,
  FileText,
  Search,
  Bell,
  SlidersHorizontal,
  Home,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, isAdmin, logout, isAuthenticated } = useAuth();
  const { showToast } = useCampus();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'Complaints', path: '/complaints', icon: FileText },
    { name: 'Lost & Found', path: '/lost-found', icon: Search },
    { name: 'Admin Portal', path: '/admin', icon: ShieldCheck, adminOnly: true },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out of VignanConnect.', 'info');
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-800 to-indigo-600 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                    Vignan<span className="text-blue-600">Connect</span>
                  </span>
                  <span className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                    Vadlamudi Campus Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.adminOnly && (
                      <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">
                        DEAN
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side controls */}
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated && currentUser ? (
                <>
                  {/* Role Switcher Pill */}
                  <button
                    type="button"
                    onClick={() => setRoleModalOpen(true)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition text-left group"
                    title="Click to switch between Student and Admin demo personas"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        isAdmin ? 'bg-indigo-600' : 'bg-blue-600'
                      }`}
                    >
                      {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className="leading-none">
                      <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        {currentUser.name}
                        <SlidersHorizontal className="w-2.5 h-2.5 text-slate-400 group-hover:text-slate-700" />
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                        {isAdmin ? 'Admin / Dean' : currentUser.studentId || 'Vignan Student'}
                      </div>
                    </div>
                  </button>

                  {/* Sign Out Icon Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}

              {/* Report Issue CTA button */}
              <Link
                to="/complaints/new"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white text-xs font-bold shadow-soft transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Issue</span>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              {isAuthenticated && currentUser ? (
                <button
                  onClick={() => setRoleModalOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1"
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4 text-indigo-600" /> : <User className="w-4 h-4 text-blue-600" />}
                  <span className="text-[11px] font-bold">{isAdmin ? 'Dean' : 'Student'}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-lg"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.adminOnly && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      DEAN
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Auth options on Mobile */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{currentUser.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}

              <Link
                to="/complaints/new"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-soft"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Campus Issue</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </>
  );
};
