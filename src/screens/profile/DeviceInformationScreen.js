import React, { useMemo } from 'react';

import {
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';
import { telemetryService } from '../../services/telemetry/telemetry.service';

const DeviceInformationScreen = () => {
  const today = new Date().toISOString().slice(0, 10);
  const latest = useApiResource(() => telemetryService.deskLatest(today), [today]);
  const connected = useMemo(() => {
    const rows = listFromEnvelope(latest.data);
    return Array.isArray(rows) && rows.length > 0;
  }, [latest.data]);
  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Device Information</Text>

    <Text style={styles.sub}>
      System details & agent connection status
    </Text>

    <View style={styles.card}>
      <Text style={styles.label}>Platform</Text>
      <Text style={styles.value}>
        {Platform.OS.toUpperCase()} {String(Platform.Version)}
      </Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.label}>App Version</Text>
      <Text style={styles.value}>0.0.1 (demo)</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.label}>Paired Agent</Text>
      <Text style={connected ? styles.value : styles.statusError}>{connected ? 'Connected' : 'Not Connected'}</Text>

      <Text style={styles.helper}>
        {connected
          ? 'Desktop agent is reporting activity for your account.'
          : 'Not connected. After a backend security update, re-pair the desktop agent: Attendance → Pair Device, then enter the new code in the agent.'}
      </Text>
    </View>
    <AsyncState loading={latest.loading} error={latest.error} onRetry={latest.reload} />
  </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#020617',
  },

  h1: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  sub: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
  },

  statusError: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 6,
  },

  helper: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
  },
});

export default DeviceInformationScreen;