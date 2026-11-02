import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  VIGNAN_DEFAULT_COMPLAINTS,
  VIGNAN_DEFAULT_LOST_ITEMS,
  VIGNAN_DEFAULT_ANNOUNCEMENTS,
  computePulseStats
} from '../data/vignanSeed';

const CampusContext = createContext();

const STORAGE_KEYS = {
  complaints: 'vignan_campus_complaints_v2',
  lostItems: 'vignan_campus_lost_items_v2',
  announcements: 'vignan_campus_announcements_v2'
};

// Safe API helper
const requestApi = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });

    const text = await res.text();
    let data = null;

    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        return { ok: false, status: res.status, data: null };
      }
    }

    if (!res.ok) {
      return { ok: false, status: res.status, data };
    }

    return { ok: true, status: res.status, data };
  } catch (netErr) {
    return { ok: false, status: 0 };
  }
};

export const CampusProvider = ({ children }) => {
  // Synchronous initial state from localStorage or Vignan defaults
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.complaints);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return VIGNAN_DEFAULT_COMPLAINTS;
  });

  const [lostItems, setLostItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.lostItems);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return VIGNAN_DEFAULT_LOST_ITEMS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.announcements);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return VIGNAN_DEFAULT_ANNOUNCEMENTS;
  });

  const [backendConnected, setBackendConnected] = useState(false);
  const [stats, setStats] = useState(() =>
    computePulseStats(VIGNAN_DEFAULT_COMPLAINTS, VIGNAN_DEFAULT_LOST_ITEMS, false)
  );

  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notifications
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
      localStorage.setItem(STORAGE_KEYS.lostItems, JSON.stringify(lostItems));
      localStorage.setItem(STORAGE_KEYS.announcements, JSON.stringify(announcements));
    } catch (e) {}
  }, [complaints, lostItems, announcements]);

  // Synchronize with backend API without infinite loop
  const refreshAll = useCallback(async () => {
    try {
      const [complaintsRes, lostRes, annRes, statsRes] = await Promise.all([
        requestApi('/api/complaints'),
        requestApi('/api/lost-items'),
        requestApi('/api/announcements'),
        requestApi('/api/dashboard/stats')
      ]);

      let remoteComplaints = null;
      let remoteLost = null;

      if (complaintsRes.ok && Array.isArray(complaintsRes.data?.data)) {
        setBackendConnected(true);
        remoteComplaints = complaintsRes.data.data;
        setComplaints(remoteComplaints);
      }
      if (lostRes.ok && Array.isArray(lostRes.data?.data)) {
        remoteLost = lostRes.data.data;
        setLostItems(remoteLost);
      }
      if (annRes.ok && Array.isArray(annRes.data?.data)) {
        setAnnouncements(annRes.data.data);
      }
      if (statsRes.ok && statsRes.data?.data) {
        setStats(statsRes.data.data);
      } else if (remoteComplaints || remoteLost) {
        setStats(computePulseStats(remoteComplaints || complaints, remoteLost || lostItems, true));
      }
    } catch (err) {
      console.warn('[Sync Error]', err);
    }
  }, []); // Stable empty dependency array

  // Initial load: runs ONCE on component mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Submit new complaint
  const submitComplaint = async (formData) => {
    const fallbackId = 'vig-' + Date.now();
    const newDoc = {
      _id: fallbackId,
      title: formData.title.trim(),
      category: formData.category || 'Other',
      location: formData.location.trim(),
      description: formData.description.trim(),
      status: 'Pending',
      studentName: formData.studentName || 'Pavan Kumar Reddy',
      studentEmail: formData.studentEmail || '221fa04108@vignan.ac.in',
      priority: formData.priority || 'Medium',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update state immediately for instant, flicker-free feedback
    setComplaints((prev) => [newDoc, ...prev]);
    setStats((prev) => computePulseStats([newDoc, ...complaints], lostItems, backendConnected));

    // Async backend persist
    requestApi('/api/complaints', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then((res) => {
      if (res.ok && res.data?.data) {
        setBackendConnected(true);
        // Replace temporary local ID with MongoDB ObjectId
        setComplaints((prev) =>
          prev.map((c) => (c._id === fallbackId ? res.data.data : c))
        );
      }
    });

    showToast('Complaint reported successfully! Ticket generated in VFSTR database.', 'success');
    return { success: true, data: newDoc };
  };

  // Update complaint status (Admin)
  const updateComplaintStatus = async (id, status, adminNotes = '') => {
    // Update local state immediately
    setComplaints((prev) => {
      const updatedList = prev.map((c) =>
        c._id === id
          ? {
              ...c,
              status,
              adminNotes: adminNotes !== undefined ? adminNotes : c.adminNotes,
              updatedAt: new Date().toISOString()
            }
          : c
      );
      setStats(computePulseStats(updatedList, lostItems, backendConnected));
      return updatedList;
    });

    // Fire confetti for resolved
    if (status === 'Resolved') {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Async persist to backend
    requestApi(`/api/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes })
    }).then((res) => {
      if (res.ok) setBackendConnected(true);
    });

    showToast(`Complaint status updated to "${status}"`, 'success');
    return { success: true };
  };

  // Delete complaint
  const deleteComplaint = async (id) => {
    setComplaints((prev) => {
      const filtered = prev.filter((c) => c._id !== id);
      setStats(computePulseStats(filtered, lostItems, backendConnected));
      return filtered;
    });

    requestApi(`/api/complaints/${id}`, { method: 'DELETE' });
    showToast('Complaint ticket deleted', 'info');
    return true;
  };

  // Submit lost/found item
  const submitLostItem = async (formData) => {
    const fallbackId = 'vig-item-' + Date.now();
    const newDoc = {
      _id: fallbackId,
      itemName: formData.itemName.trim(),
      type: formData.type || 'Lost',
      category: formData.category || 'Other',
      location: formData.location.trim(),
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      description: formData.description.trim(),
      contact: formData.contact.trim(),
      postedBy: formData.postedBy || 'Pavan Kumar Reddy',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    setLostItems((prev) => {
      const updated = [newDoc, ...prev];
      setStats(computePulseStats(complaints, updated, backendConnected));
      return updated;
    });

    requestApi('/api/lost-items', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then((res) => {
      if (res.ok && res.data?.data) {
        setBackendConnected(true);
        setLostItems((prev) =>
          prev.map((item) => (item._id === fallbackId ? res.data.data : item))
        );
      }
    });

    showToast(`${formData.type} item listing published!`, 'success');
    return { success: true };
  };

  // Mark item claimed / resolved
  const updateLostItemStatus = async (id, status = 'Claimed') => {
    setLostItems((prev) => {
      const updated = prev.map((item) => (item._id === id ? { ...item, status } : item));
      setStats(computePulseStats(complaints, updated, backendConnected));
      return updated;
    });

    requestApi(`/api/lost-items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    showToast(`Item marked as ${status}! Reunited successfully!`, 'success');
    return true;
  };

  // Delete lost item
  const deleteLostItem = async (id) => {
    setLostItems((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      setStats(computePulseStats(complaints, updated, backendConnected));
      return updated;
    });

    requestApi(`/api/lost-items/${id}`, { method: 'DELETE' });
    showToast('Listing removed from board', 'info');
    return true;
  };

  // Create announcement (Admin)
  const submitAnnouncement = async (formData) => {
    const fallbackId = 'vig-ann-' + Date.now();
    const newDoc = {
      _id: fallbackId,
      title: formData.title.trim(),
      message: formData.message.trim(),
      category: formData.category || 'General',
      priority: formData.priority || 'Normal',
      postedBy: formData.postedBy || 'Dean of Student Affairs - VFSTR',
      createdAt: new Date().toISOString()
    };

    setAnnouncements((prev) => [newDoc, ...prev]);

    requestApi('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then((res) => {
      if (res.ok && res.data?.data) {
        setBackendConnected(true);
        setAnnouncements((prev) =>
          prev.map((a) => (a._id === fallbackId ? res.data.data : a))
        );
      }
    });

    showToast('Vignan University notice broadcasted!', 'success');
    return { success: true };
  };

  // Delete announcement
  const deleteAnnouncement = async (id) => {
    setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    requestApi(`/api/announcements/${id}`, { method: 'DELETE' });
    showToast('Notice removed', 'info');
    return true;
  };

  // Reset demo data
  const resetDemoData = async () => {
    localStorage.removeItem(STORAGE_KEYS.complaints);
    localStorage.removeItem(STORAGE_KEYS.lostItems);
    localStorage.removeItem(STORAGE_KEYS.announcements);
    setComplaints(VIGNAN_DEFAULT_COMPLAINTS);
    setLostItems(VIGNAN_DEFAULT_LOST_ITEMS);
    setAnnouncements(VIGNAN_DEFAULT_ANNOUNCEMENTS);
    setStats(computePulseStats(VIGNAN_DEFAULT_COMPLAINTS, VIGNAN_DEFAULT_LOST_ITEMS, backendConnected));

    requestApi('/api/seed/reset', { method: 'POST' }).then(() => refreshAll());
    showToast('Vignan demo records restored to initial state!', 'success');
    return true;
  };

  // Fetch all complaints from API
  const fetchComplaints = useCallback(async () => {
    const apiRes = await requestApi('/api/complaints');
    if (apiRes.ok && Array.isArray(apiRes.data?.data)) {
      setComplaints(apiRes.data.data);
    }
  }, []);

  // Fetch all lost items from API
  const fetchLostItems = useCallback(async () => {
    const apiRes = await requestApi('/api/lost-items');
    if (apiRes.ok && Array.isArray(apiRes.data?.data)) {
      setLostItems(apiRes.data.data);
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    const apiRes = await requestApi('/api/announcements');
    if (apiRes.ok && Array.isArray(apiRes.data?.data)) {
      setAnnouncements(apiRes.data.data);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const apiRes = await requestApi('/api/dashboard/stats');
    if (apiRes.ok && apiRes.data?.data) {
      setStats(apiRes.data.data);
    }
  }, []);

  return (
    <CampusContext.Provider
      value={{
        complaints,
        lostItems,
        announcements,
        stats,
        loading,
        toasts,
        backendConnected,
        showToast,
        removeToast,
        fetchComplaints,
        fetchLostItems,
        fetchAnnouncements,
        fetchStats,
        refreshAll,
        submitComplaint,
        updateComplaintStatus,
        deleteComplaint,
        submitLostItem,
        updateLostItemStatus,
        deleteLostItem,
        submitAnnouncement,
        deleteAnnouncement,
        resetDemoData
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => useContext(CampusContext);
