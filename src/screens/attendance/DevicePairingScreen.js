import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import apiClient from '../../services/api/client';

const DevicePairingScreen = () => {
  const [code, setCode] = useState('');
  const [expiresLabel, setExpiresLabel] = useState('');

  const generate = async () => {
    try {
      setExpiresLabel('');
      const res = await apiClient.post('/api/v1/agent/pairing-code', {});
      const next = res?.pairingCode || res?.code || '';
      setCode(next);
      if (res?.expiresAt) {
        setExpiresLabel(`Expires ${new Date(res.expiresAt).toLocaleString()}`);
      } else if (typeof res?.expiresInMinutes === 'number') {
        setExpiresLabel(`Valid for ${res.expiresInMinutes} minutes`);
      }
    } catch (e) {
      setCode('');
      Alert.alert('Pairing failed', e?.message || 'Could not generate a pairing code. Try again.');
    }
  };

  const copyCode = async () => {
    if (!code) {
      Alert.alert('Pairing', 'Generate a code first.');
      return;
    }
    try {
      Clipboard.setString(code);
      Alert.alert('Copied', 'Pairing code copied to clipboard. Paste it into the desktop agent.');
    } catch (e) {
      Alert.alert('Copy failed', e?.message || 'Could not copy to clipboard.');
    }
  };

  const shareCode = async () => {
    if (!code) {
      Alert.alert('Pairing', 'Generate a code first.');
      return;
    }
    try {
      await Share.share({
        message: `Remote Work Tracker pairing code: ${code}`,
      });
    } catch (e) {
      if (e?.message && !String(e.message).includes('User did not share')) {
        Alert.alert('Share failed', e.message);
      }
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Device Pairing</Text>

      <Text style={styles.sub}>
        Securely link this account with your work desktop agent. If the agent stopped syncing after a security update, generate a new code and re-pair.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>One-Time Pairing Code</Text>

        <Text style={styles.code}>{code || '• • • • • •'}</Text>

        <Text style={styles.expiry}>{expiresLabel || 'Generate a code to see expiry'}</Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={generate}>
        <Text style={styles.primaryText}>Generate Secure Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={copyCode}>
        <Text style={styles.secondaryText}>Copy to Clipboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={shareCode}>
        <Text style={styles.secondaryText}>Share Code</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Never share this code outside your organization. Re-pairing replaces the previous agent session.
      </Text>
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
    alignItems: 'center',
  },

  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 10,
  },

  code: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#22C55E',
  },

  expiry: {
    fontSize: 12,
    color: '#FCA5A5',
    marginTop: 10,
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

  footer: {
    marginTop: 16,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default DevicePairingScreen;
