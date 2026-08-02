import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { notificationsService } from './notifications.service';
import { STORAGE_KEYS } from '../../utils/constants';

const PUSH_TOKEN_KEY = STORAGE_KEYS.PUSH_TOKEN || 'pushToken';

/**
 * Best-effort Expo push token registration.
 * Delivery may require native FCM/APNs setup; registration still records the token when possible.
 */
export async function registerPushToken() {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return { ok: false, reason: 'permission_denied' };
    }

    const tokenResult = await Notifications.getExpoPushTokenAsync();
    const token = tokenResult?.data;
    if (!token) {
      return { ok: false, reason: 'no_token' };
    }

    await notificationsService.registerPushToken({
      token,
      platform: Platform.OS,
    });
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    return { ok: true, token };
  } catch (e) {
    // Expo Go / missing EAS projectId often throws here — ignore.
    return { ok: false, reason: e?.message || 'unavailable' };
  }
}

/** Best-effort unregister of the last known push token (logout cleanup). */
export async function unregisterPushToken() {
  try {
    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (!token) return { ok: false, reason: 'no_token' };
    try {
      await notificationsService.unregisterPushToken({
        token,
        platform: Platform.OS,
      });
    } catch {
      // Server revoke is best-effort; always clear local token.
    }
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e?.message || 'unavailable' };
  }
}

/** @deprecated Use registerPushToken */
export const registerPushTokenStub = registerPushToken;
