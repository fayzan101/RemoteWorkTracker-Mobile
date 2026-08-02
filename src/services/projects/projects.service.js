import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

export const projectsService = {
  list(params = {}) {
    return apiClient.get(`/api/v1/projects${buildQuery(params)}`);
  },
  getById(id) {
    return apiClient.get(`/api/v1/projects/${id}`);
  },
  members(id) {
    return apiClient.get(`/api/v1/projects/${id}/members`);
  },
};
