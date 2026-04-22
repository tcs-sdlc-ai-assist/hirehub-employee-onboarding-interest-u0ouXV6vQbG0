import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';
import { SubmissionTable } from './SubmissionTable';
import { EditModal } from './EditModal';

function formatLatestDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
}

function getStats(submissions) {
  const total = submissions.length;
  const uniqueDepartments = new Set(submissions.map((s) => s.department)).size;
  let latestDate = null;
  if (submissions.length > 0) {
    latestDate = submissions.reduce((latest, s) => {
      if (!latest) return s.submittedAt;
      return s.submittedAt > latest ? s.submittedAt : latest;
    }, null);
  }
  return {
    total,
    uniqueDepartments,
    latestDate,
  };
}

export function AdminDashboard() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [banner, setBanner] = useState(null);

  const loadSubmissions = useCallback(() => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => {
      setBanner(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [banner]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/admin');
  }, [logout, navigate]);

  const handleEdit = useCallback((submission) => {
    setEditingSubmission(submission);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      const result = deleteSubmission(id);
      if (result.success) {
        loadSubmissions();
        setBanner({ type: 'success', message: 'Submission deleted successfully.' });
      } else {
        setBanner({ type: 'error', message: result.error || 'Failed to delete submission.' });
      }
    },
    [loadSubmissions]
  );

  const handleSave = useCallback(
    (id, updates) => {
      const result = updateSubmission(id, updates);
      if (result.success) {
        setEditingSubmission(null);
        loadSubmissions();
        setBanner({ type: 'success', message: 'Submission updated successfully.' });
      } else {
        setBanner({ type: 'error', message: result.error || 'Failed to update submission.' });
      }
    },
    [loadSubmissions]
  );

  const handleCloseModal = useCallback(() => {
    setEditingSubmission(null);
  }, []);

  const stats = getStats(submissions);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {banner && (
        <div
          className={`banner ${banner.type === 'success' ? 'banner-success' : 'banner-error'}`}
          role="alert"
        >
          <span className="banner-icon">{banner.type === 'success' ? '✓' : '✕'}</span>
          <span className="banner-message">{banner.message}</span>
          <button
            type="button"
            className="banner-dismiss"
            onClick={() => setBanner(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total Submissions</div>
          <div className="stat-card-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Unique Departments</div>
          <div className="stat-card-value">{stats.uniqueDepartments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Latest Submission</div>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-lg)' }}>
            {formatLatestDate(stats.latestDate)}
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Submissions</h2>
        </div>
        <SubmissionTable
          submissions={submissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {editingSubmission && (
        <EditModal
          submission={editingSubmission}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default AdminDashboard;