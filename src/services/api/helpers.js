export function buildQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    sp.append(key, String(value));
  });
  const query = sp.toString();
  return query ? `?${query}` : '';
}

export function listFromEnvelope(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.attendanceLogs)) return payload.attendanceLogs;
  if (payload.data && Array.isArray(payload.data.data)) return payload.data.data;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

export function objectFromEnvelope(payload) {
  if (!payload) return null;
  if (Array.isArray(payload)) return null;
  if (
    payload &&
    typeof payload === 'object' &&
    payload.data &&
    typeof payload.data === 'object' &&
    !Array.isArray(payload.data) &&
    payload.data.data &&
    typeof payload.data.data === 'object' &&
    !Array.isArray(payload.data.data)
  ) {
    return payload.data.data;
  }
  if (payload && typeof payload === 'object' && payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
}

/** Desk-telemetry attendance row: API uses checkIn/checkOut; tolerate firstSeen/lastSeen if present */
export function attendanceRowSeen(r) {
  if (!r) return { first: null, last: null };
  return {
    first: r.firstSeen ?? r.checkIn ?? r.check_in ?? null,
    last: r.lastSeen ?? r.checkOut ?? r.check_out ?? null,
  };
}

/** Normalize notification rows from portal API (`status`, `createdAt`, camelCase ids). */
export function mapNotification(n) {
  if (!n || typeof n !== 'object') return null;
  const status = String(n.status || '').toUpperCase();
  const read =
    status === 'READ' ||
    Boolean(n.read || n.is_read || n.isRead);
  return {
    id: n.notificationId || n.notification_id || n.id || null,
    type: n.type || 'Update',
    title: n.message || n.title || 'Notification',
    time: n.createdAt || n.created_at
      ? new Date(n.createdAt || n.created_at).toLocaleString()
      : '',
    read,
    status: read ? 'READ' : 'UNREAD',
    raw: n,
  };
}

export function mapNotifications(payload) {
  return listFromEnvelope(payload).map(mapNotification).filter(Boolean);
}

/**
 * Completion % from analytics overview / dashboard shapes.
 * Prefers explicit completionRate, else derives from work.tasks totals.
 */
export function completionRateFromOverview(overview) {
  const data = objectFromEnvelope(overview) || overview || {};
  const facts = data.facts || data;
  const direct =
    facts?.tasks?.completionRate ??
    facts?.work?.tasks?.completionRate ??
    data?.tasks?.completionRate;
  if (Number.isFinite(Number(direct))) return Math.round(Number(direct));

  const workTasks = facts?.work?.tasks || data?.work?.tasks || {};
  const total = Number(workTasks.total ?? 0);
  const openOrActive = Number(workTasks.openOrActive ?? workTasks.open ?? 0);
  if (total > 0) {
    const completed = Math.max(0, total - openOrActive);
    return Math.round((completed / total) * 100);
  }
  return 0;
}

/** Canonical task statuses shared with web/backend. */
export const TASK_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: '#60A5FA' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#F59E0B' },
  { value: 'COMPLETED', label: 'Completed', color: '#22C55E' },
];

const TASK_STATUS_ALIASES = {
  open: 'PENDING',
  pending: 'PENDING',
  'in progress': 'IN_PROGRESS',
  in_progress: 'IN_PROGRESS',
  blocked: 'IN_PROGRESS',
  done: 'COMPLETED',
  completed: 'COMPLETED',
};

export function normalizeTaskStatus(value) {
  if (!value) return 'PENDING';
  const raw = String(value).trim();
  const upper = raw.toUpperCase().replace(/\s+/g, '_');
  if (TASK_STATUSES.some((s) => s.value === upper)) return upper;
  return TASK_STATUS_ALIASES[raw.toLowerCase()] || upper;
}

export function taskStatusLabel(value) {
  const normalized = normalizeTaskStatus(value);
  return TASK_STATUSES.find((s) => s.value === normalized)?.label || normalized;
}

/** Local calendar date as YYYY-MM-DD */
export function todayIsoDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
