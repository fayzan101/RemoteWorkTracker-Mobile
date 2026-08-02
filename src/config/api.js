import { Platform } from 'react-native';

/** Hosted backend — used in production when no env override is set. */
const DEFAULT_HOSTED_API = 'https://remote-work-tracker.vercel.app';

function normalizeBaseUrl(url) {
  return String(url).trim().replace(/\s+/g, '').replace(/\/+$/, '');
}

/**
 * __DEV__: Android emulator → 10.0.2.2:5000, else localhost:5000.
 * Production: EXPO_PUBLIC_API_BASE_URL or EXPO_PUBLIC_API_URL, else hosted default.
 * Physical devices in __DEV__ should set EXPO_PUBLIC_API_BASE_URL to your PC LAN IP.
 */
function resolveDevBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
}

function resolveProdBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  }
  if (process.env.EXPO_PUBLIC_API_URL) {
    return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL);
  }
  return DEFAULT_HOSTED_API;
}

export const API_BASE_URL = __DEV__ ? resolveDevBaseUrl() : resolveProdBaseUrl();
