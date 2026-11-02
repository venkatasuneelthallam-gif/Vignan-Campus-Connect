import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';
import { useCampus } from '../context/CampusContext';

export const Footer = () => {
  const { stats, resetDemoData } = useCampus();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-amber-300 shadow-soft">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight">
                  Vignan<span className="text-blue-400">Connect</span>
                </span>
                <span className="text-[11px] block text-amber-400 font-semibold tracking-wide">
                  VFSTR • NAAC 'A+' Accredited
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Official campus issue resolution, lost belongings registry, and verified notice board for Vignan's Foundation for Science, Technology & Research (VFSTR).
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Vadlamudi, Chebrolu Mandal, Guntur District, Andhra Pradesh - 522213</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span><a href="https://www.vignan.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                  https://www.vignan.ac.in
                </a></span>
              </div>
            </div>

            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Campus Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/complaints" className="hover:text-blue-400 transition">Complaints Directory</Link>
              </li>
              <li>
                <Link to="/complaints/new" className="hover:text-blue-400 transition">Report Facility Fault</Link>
              </li>
              <li>
                <Link to="/lost-found" className="hover:text-blue-400 transition">Lost & Found Portal</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition">Vignan Campus Pulse</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-400 transition">Dean & Estate Office</Link>
              </li>
            </ul>
          </div>

          {/* Exhibition Controls */}
          <div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} Vignan's Foundation for Science, Technology & Research (VFSTR). All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  );
};
