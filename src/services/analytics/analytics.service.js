import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

/**
 * Maps dashboard summary (when analytics overview is unavailable) into the
 * shape mobile dashboards read via completionRateFromOverview.
 */
function mapDashboardSummaryToOverviewShape(summary) {
  if (!summary || typeof summary !== 'object') return null;
  return {
    facts: {
      kind: 'telemetry_facts',
      work: summary.work || {},
      telemetry: summary.telemetry || {},
      viewerDesk: summary.me || null,
      unreadNotifications: summary.unreadNotifications,
    },
    period: summary.period,
    source: 'dashboard_summary_fallback',
  };
}

const EMPTY_OVERVIEW = {
  facts: {
    work: { tasks: { total: 0, openOrActive: 0 } },
  },
  source: 'client_fallback',
};

function emptySeriesPayload() {
  return { meta: null, data: [] };
}

async function getAnalyticsSeries(path) {
  try {
    return await apiClient.get(path);
  } catch (e) {
    if (e?.status === 404) return emptySeriesPayload();
    throw e;
  }
}

export const analyticsService = {
  /**
   * Prefers `GET /api/v1/analytics/overview`.
   * Falls back to `GET /api/v1/dashboard/summary`, then zeros.
   */
  async overview(params = {}) {
    const q = buildQuery(params);
    try {
      return await apiClient.get(`/api/v1/analytics/overview${q}`);
    } catch (e) {
      if (e?.status !== 404) throw e;
    }
    try {
      const dash = await apiClient.get(`/api/v1/dashboard/summary${q}`);
      const mapped = mapDashboardSummaryToOverviewShape(dash);
      if (mapped) return mapped;
    } catch (e) {
      if (e?.status !== 404) throw e;
    }
    return EMPTY_OVERVIEW;
  },
  productivity(params = {}) {
    return getAnalyticsSeries(`/api/v1/analytics/productivity${buildQuery(params)}`);
  },
  teamPerformance(params = {}) {
    return getAnalyticsSeries(`/api/v1/analytics/team-performance${buildQuery(params)}`);
  },
};
