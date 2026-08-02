import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { buildQuery } from '../api/helpers';
import { STORAGE_KEYS } from '../../utils/constants';

const QUEUE_KEY = STORAGE_KEYS.ATTENDANCE_OFFLINE_QUEUE;
const SESSION_KEY = STORAGE_KEYS.ATTENDANCE_SESSION_ID;

function normalizeAttendancePayload(raw) {
  const attendanceLogs = Array.isArray(raw?.attendanceLogs)
    ? raw.attendanceLogs
    : Array.isArray(raw?.data)
      ? raw.data
      : [];
  return { attendanceLogs, meta: raw?.meta ?? null };
}

async function readQueue() {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeQueue(items) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export const attendanceService = {
  async myList(params = {}) {
    const raw = await apiClient.get(`/api/v1/attendance/me${buildQuery(params)}`);
    return normalizeAttendancePayload(raw);
  },
  async list(params = {}) {
    const raw = await apiClient.get(`/api/v1/attendance${buildQuery(params)}`);
    return normalizeAttendancePayload(raw);
  },

  async getOpenSessionId() {
    return AsyncStorage.getItem(SESSION_KEY);
  },

  async setOpenSessionId(sessionId) {
    if (sessionId) {
      await AsyncStorage.setItem(SESSION_KEY, sessionId);
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
  },

  async checkIn({ latitude, longitude, ipAddress, deviceId }) {
    const body = { latitude, longitude, ipAddress };
    if (deviceId) body.deviceId = deviceId;
    const res = await apiClient.post('/api/v1/attendance/check-in', body);
    const sessionId = res?.sessionId || res?.attendanceId || null;
    if (sessionId) await this.setOpenSessionId(sessionId);
    return res;
  },

  async checkOut({ sessionId, latitude, longitude, ipAddress, deviceId } = {}) {
    let id = sessionId || (await this.getOpenSessionId());
    if (!id) throw new Error('No open check-in session found');
    const body = { sessionId: id };
    if (deviceId) body.deviceId = deviceId;
    // lat/lon/ip are accepted by the client for offline queue parity; API only needs sessionId
    void latitude;
    void longitude;
    void ipAddress;
    const res = await apiClient.post('/api/v1/attendance/check-out', body);
    await this.setOpenSessionId(null);
    return res;
  },

  async enqueueFailedCheckIn(payload) {
    const queue = await readQueue();
    queue.push({
      ...payload,
      type: 'check-in',
      queuedAt: new Date().toISOString(),
    });
    await writeQueue(queue);
    return queue.length;
  },

  async getOfflineQueueLength() {
    const queue = await readQueue();
    return queue.length;
  },

  /** Flush queued check-ins. Returns { flushed, remaining, lastError }. */
  async flushOfflineQueue() {
    const queue = await readQueue();
    if (!queue.length) return { flushed: 0, remaining: 0, lastError: null };

    const remaining = [];
    let flushed = 0;
    let lastError = null;

    for (let i = 0; i < queue.length; i += 1) {
      const item = queue[i];
      try {
        if (item.type === 'check-in') {
          await this.checkIn({
            latitude: item.latitude,
            longitude: item.longitude,
            ipAddress: item.ipAddress,
            deviceId: item.deviceId,
          });
          flushed += 1;
        } else {
          remaining.push(item);
        }
      } catch (e) {
        lastError = e?.message || 'Flush failed';
        // Stop on first failure (likely still offline or fence error)
        remaining.push(...queue.slice(i));
        break;
      }
    }

    await writeQueue(remaining);
    return { flushed, remaining: remaining.length, lastError };
  },
};
