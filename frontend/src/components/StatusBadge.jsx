const LABELS = {
  available: 'Available',
  occupied: 'Occupied',
  blocked: 'Blocked',
  pending: 'Pending',
  active: 'Active',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  completed: 'Completed',
  no_show: 'No-show',
};

export default function StatusBadge({ status }) {
  const normalized = typeof status === 'string' ? status.toLowerCase() : status;
  const badgeClass = normalized === 'active' ? 'accepted' : normalized;
  return <span className={`badge badge-${badgeClass}`}>{LABELS[normalized] || status}</span>;
}
