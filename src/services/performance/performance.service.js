import apiClient from '../api/client';
import { buildQuery, listFromEnvelope } from '../api/helpers';

export const performanceService = {
  async myReviews(params = {}) {
    const raw = await apiClient.get(`/api/v1/performance${buildQuery(params)}`);
    return {
      reviews: listFromEnvelope(raw),
      meta: raw?.meta ?? null,
    };
  },
};
