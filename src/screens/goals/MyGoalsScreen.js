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
import { goalsService } from '../../services/goals/goals.service';
import { listFromEnvelope } from '../../services/api/helpers';

const MyGoalsScreen = () => {
  const resource = useApiResource(() => goalsService.list({ limit: 50 }), []);
  const [editingId, setEditingId] = useState(null);
  const [progressDraft, setProgressDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const goals = useMemo(() => {
    const rows = listFromEnvelope(resource.data);
    return rows.map((g) => ({
      id: g.goalId || g.goal_id,
      title: g.title || 'Goal',
      description: g.description || '',
      progress: Number(g.progress ?? 0),
      status: g.status || (Number(g.progress ?? 0) >= 50 ? 'ON_TRACK' : 'AT_RISK'),
      deadline: g.deadline ? new Date(g.deadline).toLocaleDateString() : '—',
    }));
  }, [resource.data]);

  const saveProgress = async (goalId) => {
    const progress = Number(progressDraft);
    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      Alert.alert('Invalid progress', 'Enter a number between 0 and 100.');
      return;
    }
    setSaving(true);
    try {
      await goalsService.updateProgress(goalId, progress);
      setEditingId(null);
      setProgressDraft('');
      await resource.reload();
    } catch (e) {
      Alert.alert('Update failed', e?.message || 'Could not update progress');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>My Goals</Text>
      <Text style={styles.sub}>Track progress on goals assigned to you</Text>

      <AsyncState
        loading={resource.loading}
        error={resource.error}
        empty={!goals.length}
        onRetry={resource.reload}
      >
        {goals.map((g) => (
          <View key={g.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title}>{g.title}</Text>
              <Text
                style={[
                  styles.badge,
                  g.status === 'ON_TRACK' ? styles.onTrack : styles.atRisk,
                ]}
              >
                {g.status === 'ON_TRACK' ? 'On track' : 'At risk'}
              </Text>
            </View>
            {g.description ? <Text style={styles.desc}>{g.description}</Text> : null}
            <Text style={styles.meta}>Deadline · {g.deadline}</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${Math.min(100, g.progress)}%` }]} />
            </View>
            <Text style={styles.progress}>{g.progress}%</Text>

            {editingId === g.id ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={progressDraft}
                  onChangeText={setProgressDraft}
                  placeholder="0-100"
                  placeholderTextColor="#64748B"
                  editable={!saving}
                />
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => saveProgress(g.id)}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveText}>Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setEditingId(null);
                    setProgressDraft('');
                  }}
                  disabled={saving}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditingId(g.id);
                  setProgressDraft(String(g.progress));
                }}
              >
                <Text style={styles.editText}>Update progress</Text>
              </TouchableOpacity>
            )}
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '800', color: '#E2E8F0', flex: 1, paddingRight: 8 },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  onTrack: { color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.15)' },
  atRisk: { color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.15)' },
  desc: { marginTop: 8, color: '#94A3B8', fontSize: 13, lineHeight: 18 },
  meta: { marginTop: 8, color: '#64748B', fontSize: 12 },
  barBg: {
    marginTop: 10,
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: '#3B82F6' },
  progress: { marginTop: 6, color: '#60A5FA', fontWeight: '700', fontSize: 13 },
  editBtn: { marginTop: 12, alignSelf: 'flex-start' },
  editText: { color: '#60A5FA', fontWeight: '700', fontSize: 13 },
  editRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  input: {
    minWidth: 72,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#E2E8F0',
  },
  saveBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  cancelBtn: { paddingHorizontal: 8, paddingVertical: 8 },
  cancelText: { color: '#94A3B8', fontWeight: '700', fontSize: 12 },
});

export default MyGoalsScreen;
