import React from 'react';
import './StatusBadge.css';

const STATUS_VARIANTS = {
  // Generic
  active: 'badge-success',
  inactive: 'badge-neutral',
  pending: 'badge-warning',
  completed: 'badge-success',
  cancelled: 'badge-danger',
  failed: 'badge-danger',
  // Livestock
  healthy: 'badge-success',
  sick: 'badge-warning',
  critical: 'badge-danger',
  recovered: 'badge-info',
  sold: 'badge-neutral',
  dead: 'badge-danger',
  // Requests
  in_progress: 'badge-info',
  // User
  suspended: 'badge-danger',
  // Custom strings
  optimal: 'badge-success',
  'near capacity': 'badge-warning',
  'attention needed': 'badge-warning',
  'pending approval': 'badge-warning',
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const key = status.toLowerCase();
  const variant = STATUS_VARIANTS[key] || 'badge-neutral';
  return (
    <span className={`status-badge ${variant}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
