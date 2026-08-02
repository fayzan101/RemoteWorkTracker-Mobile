import * as Location from 'expo-location';

/** Best-effort public IP for check-in payload. */
export async function resolveIpAddress() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return '0.0.0.0';
    const json = await res.json();
    return typeof json?.ip === 'string' && json.ip.length >= 3 ? json.ip : '0.0.0.0';
  } catch {
    return '0.0.0.0';
  }
}

export async function getCheckInCoords() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission is required for check-in');
  }
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  };
}
