export { API_BASE_URL } from '../config/api';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  /** @deprecated legacy key; migrated on read */
  LEGACY_TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PUSH_TOKEN: 'pushToken',
  ATTENDANCE_SESSION_ID: 'attendanceOpenSessionId',
  ATTENDANCE_OFFLINE_QUEUE: 'attendanceOfflineQueue',
};
