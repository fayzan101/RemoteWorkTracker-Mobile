import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { tasksService } from '../../services/tasks/tasks.service';
import { normalizeTaskStatus, TASK_STATUSES } from '../../services/api/helpers';

const UpdateTaskStatusScreen = ({ route, navigation }) => {
  const taskId = route.params?.taskId;
  const currentStatus = normalizeTaskStatus(route.params?.currentStatus || 'PENDING');
  const [selected, setSelected] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Update Status</Text>
      <Text style={styles.sub}>Select the current progress of this task</Text>

      {TASK_STATUSES.map((s) => {
        const active = selected === s.value;
        return (
          <TouchableOpacity
            key={s.value}
            style={[
              styles.card,
              active && { borderColor: s.color, backgroundColor: `${s.color}15` },
            ]}
            onPress={() => setSelected(s.value)}
            disabled={saving}
          >
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={styles.label}>{s.label}</Text>
            </View>
            {active ? (
              <Text style={[styles.selected, { color: s.color }]}>Selected</Text>
            ) : null}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.saveBtn, saving && { opacity: 0.7 }]}
        disabled={saving}
        onPress={async () => {
          if (!taskId) {
            Alert.alert('Missing task', 'Task id is required.');
            return;
          }
          setSaving(true);
          try {
            await tasksService.update(taskId, { status: selected });
            navigation.goBack();
          } catch (e) {
            Alert.alert('Update failed', e?.message || 'Could not update status');
          } finally {
            setSaving(false);
          }
        }}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 30, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  label: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  selected: { fontSize: 12, fontWeight: '800', marginTop: 6 },
  saveBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0F766E',
    alignItems: 'center',
  },
  saveText: { color: '#0F172A', fontWeight: '800' },
});

export default UpdateTaskStatusScreen;
