import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';

export const tasksService = {
  list(params = {}) {
    return apiClient.get(`/api/v1/tasks${buildQuery(params)}`);
  },
  getById(id) {
    return apiClient.get(`/api/v1/tasks/${id}`);
  },
  update(id, payload) {
    return apiClient.request(`/api/v1/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  comments(taskId) {
    return apiClient.get(`/api/v1/tasks/${taskId}/comments`);
  },
  addComment(taskId, content) {
    return apiClient.post(`/api/v1/tasks/${taskId}/comments`, { comment: content });
  },
  listAttachments(taskId) {
    return apiClient.get(`/api/v1/tasks/${taskId}/attachments`);
  },
  addAttachment(taskId, payload) {
    const file_path = payload?.file_path || payload?.filePath || payload?.fileUrl || payload?.fileName;
    return apiClient.post(`/api/v1/tasks/${taskId}/attachments`, { file_path });
  },
  deleteAttachment(taskId, attachmentId) {
    return apiClient.request(`/api/v1/tasks/${taskId}/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
  },
};
