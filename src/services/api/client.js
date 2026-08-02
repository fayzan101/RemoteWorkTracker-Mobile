import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config/api';
import { STORAGE_KEYS } from '../../utils/constants';

/**
 * @param {object} json
 * @returns {unknown} Unwrapped `data` when the API uses { success, data }, else the full JSON.
 */
function unwrapResponse(json) {
  if (
    json &&
    typeof json === 'object' &&
    'success' in json &&
    json.success === true &&
    Object.prototype.hasOwnProperty.call(json, 'data')
  ) {
    return json.data;
  }
  return json;
}

function errorMessage(json, fallback) {
  if (!json || typeof json !== 'object') return fallback;
  if (typeof json.message === 'string' && json.message.trim()) return json.message;
  if (typeof json.error === 'string' && json.error.trim()) return json.error;
  if (json.error && typeof json.error === 'object' && typeof json.error.message === 'string') {
    return json.error.message;
  }
  if (Array.isArray(json.errors) && typeof json.errors[0] === 'string') return json.errors[0];
  return fallback;
}

function rateLimitMessage(json) {
  return errorMessage(json, 'Too many requests. Please wait a moment and try again.');
}

/** Optional listeners notified when the session can no longer be refreshed. */
const sessionExpiredListeners = new Set();

export function onSessionExpired(listener) {
  if (typeof listener !== 'function') return () => {};
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

function emitSessionExpired() {
  sessionExpiredListeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // Ignore listener errors so auth cleanup always proceeds.
    }
  });
}

export async function getAccessToken() {
  let t = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (!t) {
    t = await AsyncStorage.getItem(STORAGE_KEYS.LEGACY_TOKEN);
    if (t) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, t);
      await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN);
    }
  }
  return t;
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function saveTokens(accessToken, refreshToken) {
  const ops = [AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)];
  if (refreshToken) {
    ops.push(AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken));
  }
  await Promise.all(ops);
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.LEGACY_TOKEN,
  ]);
}

/** Single in-flight refresh so parallel 401s share one refresh call. */
let refreshInFlight = null;

async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    const url = `${API_BASE_URL}/api/v1/users/refresh-token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await response.json().catch(() => ({}));
    if (response.status === 429) {
      const err = new Error(rateLimitMessage(json));
      err.status = 429;
      throw err;
    }
    if (!response.ok) {
      throw new Error(errorMessage(json, 'Session expired. Please sign in again.'));
    }
    const data = unwrapResponse(json);
    await saveTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * @param {string} endpoint
   * @param {RequestInit & { headers?: Record<string, string> }} options
   * @param {boolean} retry401
   */
  async request(endpoint, options = {}, retry401 = true) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await getAccessToken();
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    const isRefreshEndpoint = endpoint === '/api/v1/users/refresh-token';
    let response = await fetch(url, config);
    let json = await response.json().catch(() => ({}));

    if (response.status === 401 && retry401 && !isRefreshEndpoint) {
      try {
        const newAccess = await refreshAccessToken();
        const retryConfig = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(newAccess ? { Authorization: `Bearer ${newAccess}` } : {}),
            ...options.headers,
          },
        };
        response = await fetch(url, retryConfig);
        json = await response.json().catch(() => ({}));
      } catch (e) {
        if (e?.status === 429) {
          const err = new Error(e.message || rateLimitMessage({}));
          err.status = 429;
          err.body = e.body;
          throw err;
        }
        await clearTokens();
        emitSessionExpired();
        throw new Error('Session expired. Please sign in again.');
      }
    }

    if (!response.ok) {
      const message =
        response.status === 429
          ? rateLimitMessage(json)
          : errorMessage(json, 'An error occurred');
      const err = new Error(message);
      err.status = response.status;
      err.body = json;
      throw err;
    }

    return unwrapResponse(json);
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data ?? {}),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data ?? {}),
    });
  }

  delete(endpoint, data) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
    });
  }

  /**
   * POST without Authorization header (e.g. sign-in).
   */
  postPublic(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data ?? {}),
    }).then(async (response) => {
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message =
          response.status === 429
            ? rateLimitMessage(json)
            : errorMessage(json, 'Request failed');
        const err = new Error(message);
        err.status = response.status;
        err.body = json;
        throw err;
      }
      return unwrapResponse(json);
    });
  }
}

export default new ApiClient(API_BASE_URL);
