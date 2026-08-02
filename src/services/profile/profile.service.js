import apiClient from '../api/client';

export const profileService = {
  me() {
    return apiClient.get('/api/v1/users/profile');
  },
  update(payload) {
    return apiClient.request('/api/v1/users/profile', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  changePassword(payload) {
    return apiClient.post('/api/v1/users/change-password', payload);
  },
  managers() {
    return apiClient.get('/api/v1/users/managers');
  },
};
