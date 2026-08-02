import React, { useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { useApiResource } from '../../hooks/useApiResource';
import { complianceService } from '../../services/compliance/compliance.service';

const MyViolationsScreen = () => {
  const resource = useApiResource(() => complianceService.myViolations({ limit: 50 }), []);
  const [ackRuleId, setAckRuleId] = useState(null);
  const [signature, setSignature] = useState('');
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const list = Array.isArray(resource.data?.violations) ? resource.data.violations : [];
    return list.map((v) => ({
      key: v.violationId || v.id || String(Math.random()),
      description: v.description || 'Compliance violation',
      status: v.status || 'OPEN',
      ruleId: v.ruleId || v.rule_id || null,
      createdAt: v.createdAt ? new Date(v.createdAt).toLocaleString() : '—',
    }));
  }, [resource.data]);

  const submitAck = async (ruleId) => {
    const text = signature.trim();
    if (text.length < 2) {
      Alert.alert('Signature required', 'Type your full name to acknowledge the rule.');
      return;
    }
    setSaving(true);
    try {
      await complianceService.acknowledgeRule(ruleId, text);
      Alert.alert('Acknowledged', 'Your acknowledgement was recorded.');
      setAckRuleId(null);
      setSignature('');
      await resource.reload();
    } catch (e) {
      Alert.alert('Acknowledge failed', e?.message || 'Could not acknowledge rule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>My Violations</Text>
      <Text style={styles.sub}>Compliance issues linked to your account</Text>

      <AsyncState
        loading={resource.loading}
        error={resource.error}
        empty={!resource.loading && !rows.length}
        onRetry={resource.reload}
      >
        {rows.map((r) => (
          <View key={r.key} style={styles.card}>
            <Text style={styles.title}>{r.description}</Text>
            <Text style={styles.meta}>
              {r.status} · {r.createdAt}
            </Text>

            {r.ruleId ? (
              ackRuleId === r.ruleId ? (
                <View style={styles.ackBox}>
                  <Text style={styles.ackHint}>
                    Type your name to acknowledge this compliance rule
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={signature}
                    onChangeText={setSignature}
                    placeholder="Full name"
                    placeholderTextColor="#64748B"
                    editable={!saving}
                  />
                  <View style={styles.ackActions}>
                    <TouchableOpacity
                      style={styles.ackBtn}
                      onPress={() => submitAck(r.ruleId)}
                      disabled={saving}
                    >
                      {saving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.ackBtnText}>Confirm</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setAckRuleId(null);
                        setSignature('');
                      }}
                      disabled={saving}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.linkBtn}
                  onPress={() => {
                    setAckRuleId(r.ruleId);
                    setSignature('');
                  }}
                >
                  <Text style={styles.linkText}>Acknowledge related rule</Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>
        ))}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#020617' },
  h1: { fontSize: 30, fontWeight: '800', color: '#FFFFFF' },
  sub: { fontSize: 14, color: '#94A3B8', marginTop: 6, marginBottom: 18 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: { fontSize: 15, fontWeight: '800', color: '#E2E8F0' },
  meta: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  linkBtn: { marginTop: 12 },
  linkText: { color: '#60A5FA', fontWeight: '700', fontSize: 13 },
  ackBox: { marginTop: 12 },
  ackHint: { color: '#94A3B8', fontSize: 12, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  ackActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ackBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 88,
    alignItems: 'center',
  },
  ackBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  cancelText: { color: '#94A3B8', fontWeight: '700', fontSize: 12 },
});

export default MyViolationsScreen;
