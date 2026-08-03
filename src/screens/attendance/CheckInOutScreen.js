import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { attendanceService } from '../../services/attendance/attendance.service';
import { getCheckInCoords, resolveIpAddress } from '../../services/attendance/location.helpers';

function isFenceError(message) {
  const m = String(message || '').toLowerCase();
  return m.includes('geo-fence') || m.includes('geofence') || m.includes('fence');
}

const CheckInOutScreen = () => {
  const [busy, setBusy] = useState(false);
  const [statusLabel, setStatusLabel] = useState('Checking status…');
  const [sessionId, setSessionId] = useState(null);
  const [fenceError, setFenceError] = useState('');
  const [queueCount, setQueueCount] = useState(0);
  const [online, setOnline] = useState(true);

  const refreshState = useCallback(async () => {
    const id = await attendanceService.getOpenSessionId();
    setSessionId(id);
    setStatusLabel(id ? 'Checked in' : 'Checked out');
    const n = await attendanceService.getOfflineQueueLength();
    setQueueCount(n);
  }, []);

  const flushQueue = useCallback(async () => {
    const result = await attendanceService.flushOfflineQueue();
    if (result.flushed > 0) {
      Alert.alert('Synced', `Flushed ${result.flushed} queued check-in(s).`);
    }
    if (result.lastError && isFenceError(result.lastError)) {
      setFenceError(result.lastError);
    }
    await refreshState();
  }, [refreshState]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        if (!active) return;
        await refreshState();
        const net = await NetInfo.fetch();
        if (net.isConnected) {
          await flushQueue();
        }
      })();
      return () => {
        active = false;
      };
    }, [refreshState, flushQueue]),
  );

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const isOn = Boolean(state.isConnected);
      setOnline(isOn);
      if (isOn) {
        flushQueue();
      }
    });
    return () => unsub();
  }, [flushQueue]);

  const runCheckIn = async () => {
    setBusy(true);
    setFenceError('');
    try {
      const coords = await getCheckInCoords();
      const ipAddress = await resolveIpAddress();
      const payload = { ...coords, ipAddress };

      const net = await NetInfo.fetch();
      if (!net.isConnected) {
        await attendanceService.enqueueFailedCheckIn(payload);
        Alert.alert('Queued', 'You are offline. Check-in was saved and will sync when online.');
        await refreshState();
        return;
      }

      try {
        const res = await attendanceService.checkIn(payload);
        setSessionId(res?.sessionId || null);
        setStatusLabel('Checked in');
        Alert.alert('Checked in', 'Location verified.');
      } catch (e) {
        const msg = e?.message || 'Check-in failed';
        if (isFenceError(msg)) {
          setFenceError(msg);
          Alert.alert('Outside geo-fence', msg);
        } else {
          await attendanceService.enqueueFailedCheckIn(payload);
          Alert.alert(
            'Queued',
            `${msg}\n\nCheck-in was saved offline and will retry when the network is available.`,
          );
        }
        await refreshState();
      }
    } catch (e) {
      Alert.alert('Check-in failed', e?.message || 'Could not get location');
    } finally {
      setBusy(false);
    }
  };

  const runCheckOut = async () => {
    setBusy(true);
    setFenceError('');
    try {
      const coords = await getCheckInCoords().catch(() => ({ latitude: 0, longitude: 0 }));
      const ipAddress = await resolveIpAddress();
      await attendanceService.checkOut({
        sessionId,
        ...coords,
        ipAddress,
      });
      setSessionId(null);
      setStatusLabel('Checked out');
      Alert.alert('Checked out', 'Session closed.');
    } catch (e) {
      Alert.alert('Check-out failed', e?.message || 'Could not check out');
    } finally {
      setBusy(false);
      await refreshState();
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Check In / Out</Text>
      <Text style={styles.sub}>
        Use your current location. Geo-fence violations are shown below.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.status}>{statusLabel}</Text>
        <Text style={styles.meta}>
          {online ? 'Online' : 'Offline'}
          {queueCount > 0 ? ` · ${queueCount} queued` : ''}
        </Text>
        {sessionId ? (
          <Text style={styles.session}>Session {String(sessionId).slice(0, 8)}…</Text>
        ) : null}
      </View>

      {fenceError ? (
        <View style={styles.fenceBox}>
          <Text style={styles.fenceTitle}>Geo-fence error</Text>
          <Text style={styles.fenceText}>{fenceError}</Text>
        </View>
      ) : null}

      {busy ? <ActivityIndicator color="#22C55E" style={{ marginVertical: 12 }} /> : null}

      <TouchableOpacity
        style={[styles.primaryBtn, (busy || sessionId) && styles.disabled]}
        onPress={runCheckIn}
        disabled={busy || Boolean(sessionId)}
      >
        <Text style={styles.primaryText}>Check In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryBtn, (busy || !sessionId) && styles.disabled]}
        onPress={runCheckOut}
        disabled={busy || !sessionId}
      >
        <Text style={styles.secondaryText}>Check Out</Text>
      </TouchableOpacity>

      {queueCount > 0 ? (
        <TouchableOpacity style={styles.secondaryBtn} onPress={flushQueue} disabled={busy}>
          <Text style={styles.secondaryText}>Retry queued check-ins</Text>
        </TouchableOpacity>
      ) : null}
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F1F5F9',
  },
  h1: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
  },
  status: {
    fontSize: 22,
    fontWeight: '900',
    color: '#22C55E',
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
  },
  session: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },
  fenceBox: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  fenceTitle: {
    color: '#B91C1C',
    fontWeight: '800',
    marginBottom: 4,
  },
  fenceText: {
    color: '#991B1B',
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: '#0F766E',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryText: {
    color: '#0F172A',
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.45,
  },
});

export default CheckInOutScreen;
