import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

export const goalsService = {
  list(params = {}) {
    return apiClient.get(`/api/v1/goals${buildQuery(params)}`);
  },
  getById(id) {
    return apiClient.get(`/api/v1/goals/${id}`);
  },
  updateProgress(id, progress) {
    return apiClient.patch(`/api/v1/goals/${id}/progress`, { progress });
  },
};
