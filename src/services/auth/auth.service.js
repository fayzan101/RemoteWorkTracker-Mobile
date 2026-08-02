import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config/api';
import { STORAGE_KEYS } from '../../utils/constants';
import { saveTokens, clearTokens } from '../api/client';

function extractErrorMessage(json, fallback) {
  if (!json || typeof json !== 'object') return fallback;
  if (typeof json.message === 'string' && json.message.trim()) return json.message;
  if (typeof json.error === 'string' && json.error.trim()) return json.error;
  if (typeof json?.error?.message === 'string' && json.error.message.trim()) return json.error.message;
  const fieldErrors = json?.errors?.fieldErrors;
  if (fieldErrors && typeof fieldErrors === 'object') {
    const first = Object.values(fieldErrors).flat?.()[0];
    if (typeof first === 'string' && first.trim()) return first;
  }
  if (Array.isArray(json?.errors) && typeof json.errors[0] === 'string') return json.errors[0];
  return fallback;
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 */
export async function signIn(email, password) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/v1/users/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch (error) {
    throw new Error(
      `Network request failed. Cannot reach ${API_BASE_URL}. ` +
      'If using a physical phone, set EXPO_PUBLIC_API_BASE_URL to your PC LAN IP (e.g. http://192.168.x.x:5000).',
    );
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, 'Sign in failed'));
  }
  const data = json.data;
  if (!data?.accessToken) {
    throw new Error('Invalid sign-in response');
  }
  await saveTokens(data.accessToken, data.refreshToken);
  if (data.user) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  }
  return data;
}

export async function loadStoredUser() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function signOut() {
  await clearTokens();
  await AsyncStorage.removeItem(STORAGE_KEYS.USER);
}
