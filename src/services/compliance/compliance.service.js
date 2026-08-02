import apiClient from '../api/client';
import { buildQuery, listFromEnvelope } from '../api/helpers';

export const complianceService = {
  async myViolations(params = {}) {
    const raw = await apiClient.get(`/api/v1/compliance/violations${buildQuery(params)}`);
    return {
      violations: listFromEnvelope(raw),
      meta: raw?.meta ?? null,
    };
  },
  acknowledgeRule(ruleId, signatureData) {
    return apiClient.post(`/api/v1/compliance/rules/${ruleId}/acknowledge`, {
      signatureData,
    });
  },
};
