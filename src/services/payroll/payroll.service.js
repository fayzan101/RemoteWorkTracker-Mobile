import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

export const payrollService = {
  /** Self-scoped employee payroll (preferred). */
  mine(params = {}) {
    return apiClient.get(`/api/v1/payroll/me${buildQuery(params)}`);
  },
  /** @deprecated Admin-only org list — prefer mine(). */
  list(params = {}) {
    return apiClient.get(`/api/v1/payroll${buildQuery(params)}`);
  },
  byUser(userId, params = {}) {
    return apiClient.get(`/api/v1/payroll/user/${userId}${buildQuery(params)}`);
  },
  getById(id) {
    return apiClient.get(`/api/v1/payroll/${id}`);
  },
};
