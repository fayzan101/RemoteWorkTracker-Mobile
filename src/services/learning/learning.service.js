import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

export const learningService = {
  listCourses(params = {}) {
    return apiClient.get(`/api/v1/courses${buildQuery(params)}`);
  },
  listEnrollments(params = {}) {
    return apiClient.get(`/api/v1/courses/enrollments${buildQuery(params)}`);
  },
  enroll(courseId, payload = {}) {
    return apiClient.post(`/api/v1/courses/${courseId}/enroll`, payload);
  },
  getById(id) {
    return apiClient.get(`/api/v1/courses/${id}`);
  },
};
