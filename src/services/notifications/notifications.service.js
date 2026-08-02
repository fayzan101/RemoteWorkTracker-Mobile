import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

export const notificationsService = {
  list(params = {}) {
    return apiClient.get(`/api/v1/notifications${buildQuery(params)}`);
  },
  markRead(id) {
    return apiClient.request(`/api/v1/notifications/${id}/read`, { method: 'PATCH' });
  },
  markAllRead() {
    return apiClient.request('/api/v1/notifications/read-all', { method: 'PATCH' });
  },
  delete(id) {
    return apiClient.request(`/api/v1/notifications/${id}`, { method: 'DELETE' });
  },
  registerPushToken({ token, platform }) {
    return apiClient.post('/api/v1/notifications/push-token', { token, platform });
  },
  unregisterPushToken({ token, platform }) {
    return apiClient.delete('/api/v1/notifications/push-token', { token, platform });
  },
};
