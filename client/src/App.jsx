import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CampusProvider } from './context/CampusContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Complaints } from './pages/Complaints';
import { ComplaintNew } from './pages/ComplaintNew';
import { LostFound } from './pages/LostFound';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

export default function App() {
  return (
    <AuthProvider>
      <CampusProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/complaints/new" element={<ComplaintNew />} />
                <Route path="/lost-found" element={<LostFound />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Global Modern Footer */}
            <Footer />

            {/* Global Toasts */}
            <ToastContainer />
          </div>
        </Router>
      </CampusProvider>
    </AuthProvider>
  );
}

