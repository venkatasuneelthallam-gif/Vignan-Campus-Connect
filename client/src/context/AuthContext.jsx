import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  student: {
    id: 'user-vignan-stu-01',
    name: 'Pavan Kumar Reddy',
    email: '221fa04108@vignan.ac.in',
    password: 'vignan123',
    role: 'student',
    studentId: '221FA04108',
    department: 'Computer Science & Engineering (CSE)',
    campus: 'VFSTR Vadlamudi, Guntur',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  admin: {
    id: 'user-vignan-adm-01',
    name: 'Dr. K. V. Krishna Kishore',
    email: 'dean.affairs@vignan.ac.in',
    password: 'dean123',
    role: 'admin',
    title: 'Dean of Student Affairs & Estate Operations',
    studentId: 'VIG-STAFF-DEAN',
    department: 'VFSTR Administration, NTR Vignan Vihar',
    campus: 'VFSTR Vadlamudi, Guntur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  }
};

const USER_STORAGE_KEY = 'vignan_campusconnect_user_v3';
const TOKEN_STORAGE_KEY = 'vignan_campusconnect_token_v3';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      } catch (e) {}
    }
    // Default to student persona for immediate exhibition readiness
    return DEMO_USERS.student;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  // Sync token state to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  // Authenticate / Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data?.user) {
        setCurrentUser(resData.data.user);
        setToken(resData.data.token);
        setLoading(false);
        return { success: true, message: resData.message, user: resData.data.user };
      }

      // Offline / fallback verification if server cannot be reached or returned error
      const normalizedEmail = email.trim().toLowerCase();
      if (
        (normalizedEmail === DEMO_USERS.student.email && password === DEMO_USERS.student.password) ||
        (normalizedEmail === 'student' && password === 'vignan123')
      ) {
        setCurrentUser(DEMO_USERS.student);
        setToken('mock-jwt-token-student');
        setLoading(false);
        return { success: true, message: 'Signed in as Student (Demo)', user: DEMO_USERS.student };
      }

      if (
        (normalizedEmail === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) ||
        (normalizedEmail === 'admin' && password === 'dean123')
      ) {
        setCurrentUser(DEMO_USERS.admin);
        setToken('mock-jwt-token-admin');
        setLoading(false);
        return { success: true, message: 'Signed in as Dean (Demo)', user: DEMO_USERS.admin };
      }

      setLoading(false);
      return {
        success: false,
        message: resData.message || 'Invalid email or password. Please try again.'
      };
    } catch (err) {
      // Offline fallback handling
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail === DEMO_USERS.student.email && password === DEMO_USERS.student.password) {
        setCurrentUser(DEMO_USERS.student);
        setToken('mock-jwt-token-student');
        setLoading(false);
        return { success: true, message: 'Signed in as Student (Offline Mode)', user: DEMO_USERS.student };
      }

      if (normalizedEmail === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
        setCurrentUser(DEMO_USERS.admin);
        setToken('mock-jwt-token-admin');
        setLoading(false);
        return { success: true, message: 'Signed in as Dean (Offline Mode)', user: DEMO_USERS.admin };
      }

      setLoading(false);
      return {
        success: false,
        message: 'Unable to connect to server. Check that the backend is active on port 5000.'
      };
    }
  };

  // Sign up / Register
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data?.user) {
        setCurrentUser(resData.data.user);
        setToken(resData.data.token);
        setLoading(false);
        return { success: true, message: resData.message, user: resData.data.user };
      }

      // Offline fallback registration
      const newLocalUser = {
        id: 'usr-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'student',
        studentId: userData.studentId || '',
        department: userData.department || 'Computer Science & Engineering (CSE)',
        campus: 'VFSTR Vadlamudi, Guntur',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`
      };

      if (!response.ok && resData.message) {
        setLoading(false);
        return { success: false, message: resData.message };
      }

      setCurrentUser(newLocalUser);
      setToken('mock-jwt-token-' + Date.now());
      setLoading(false);
      return { success: true, message: 'Account registered locally!', user: newLocalUser };
    } catch (err) {
      // Offline graceful registration
      const newLocalUser = {
        id: 'usr-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'student',
        studentId: userData.studentId || '',
        department: userData.department || 'Computer Science & Engineering (CSE)',
        campus: 'VFSTR Vadlamudi, Guntur',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`
      };
      setCurrentUser(newLocalUser);
      setToken('mock-jwt-token-' + Date.now());
      setLoading(false);
      return { success: true, message: 'Account registered (Offline Mode)!', user: newLocalUser };
    }
  };

  // Log out
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  // Quick switch role (presentation tool)
  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
      setToken('mock-jwt-token-' + roleKey);
    }
  };

  const loginCustom = (name, email, role = 'student') => {
    const user = {
      id: 'usr-' + Date.now(),
      name,
      email: email.includes('@') ? email : `${email}@vignan.ac.in`,
      role,
      department: role === 'admin' ? 'VFSTR Administration' : 'Department of Engineering',
      campus: 'Vignan University, Vadlamudi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
    };
    setCurrentUser(user);
    setToken('custom-token-' + Date.now());
  };

  const isAdmin = currentUser?.role === 'admin';
  const isAuthenticated = Boolean(currentUser && currentUser.email);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
        loginCustom
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
