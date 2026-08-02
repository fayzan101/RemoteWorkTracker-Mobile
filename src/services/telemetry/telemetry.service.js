import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

/**
 * Desktop agent telemetry. Hosted deployments may not expose these routes yet — treat 404 as empty.
 */
export const telemetryService = {
  async deskLatest(dayYmd) {
    const q = buildQuery({ day: dayYmd });
    try {
      return await apiClient.get(`/api/v1/telemetry/agent/desk-latest${q}`);
    } catch (e) {
      if (e?.status === 404) return { day: dayYmd, data: [] };
      throw e;
    }
  },
};
