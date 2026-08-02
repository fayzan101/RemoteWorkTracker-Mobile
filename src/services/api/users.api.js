import apiClient, { saveTokens, getRefreshToken } from './client';

/**
 * @param {{ email: string; password: string }} credentials
 * @returns {Promise<{ accessToken: string; refreshToken: string; user: object }>}
 */
export async function signIn(credentials) {
  const data = await apiClient.postPublic('/api/v1/users/sign-in', credentials);
  await saveTokens(data.accessToken, data.refreshToken);
  return data;
}

/**
 * Revokes refresh token on server (requires JWT).
 * @param {string} refreshToken
 */
export async function logout(refreshToken) {
  await apiClient.post('/api/v1/users/logout', { refreshToken });
}

/**
 * @param {string} refreshToken
 * @returns {Promise<{ accessToken: string; refreshToken: string }>}
 */
export async function refreshSession(refreshToken) {
  return apiClient.postPublic('/api/v1/users/refresh-token', { refreshToken });
}

/**
 * @param {{ oldPassword: string; newPassword: string }} body
 */
export async function changePassword(body) {
  return apiClient.post('/api/v1/users/change-password', body);
}

export async function getProfile() {
  return apiClient.get('/api/v1/users/profile');
}

/**
 * @param {{ name?: string; region?: string; email?: string }} body
 */
export async function updateProfile(body) {
  return apiClient.patch('/api/v1/users/profile', body);
}

/** Call logout with stored refresh token (no-op if missing). */
export async function logoutWithStoredRefresh() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return;
  await logout(refreshToken);
}
