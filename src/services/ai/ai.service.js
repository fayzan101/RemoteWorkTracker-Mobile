import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

function emptyWeeklyReports() {
  return { history: [], latest_report: null };
}

export const aiService = {
  generateReport(payload) {
    return apiClient.post('/api/v1/ai/report', payload);
  },
  async weeklyReports(employeeId, params = {}) {
    try {
      return await apiClient.get(`/api/v1/ai/reports/${employeeId}${buildQuery(params)}`);
    } catch (e) {
      if (e?.status === 404) return emptyWeeklyReports();
      throw e;
    }
  },
};
