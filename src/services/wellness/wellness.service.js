import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

export const wellnessService = {
  listMine(params = {}) {
    return apiClient.get(`/api/v1/wellness/me${buildQuery(params)}`);
  },
  createMood(payload) {
    return apiClient.post('/api/v1/wellness/mood', payload);
  },
};
