import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { tasksService } from '../../services/tasks/tasks.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope, normalizeTaskStatus, taskStatusLabel } from '../../services/api/helpers';

const getStatusColor = (status) => {
  const value = normalizeTaskStatus(status);
  if (value === 'COMPLETED') return '#22C55E';
  if (value === 'IN_PROGRESS') return '#F59E0B';
  return '#60A5FA';
};

const MyTasksScreen = ({ navigation }) => {
  const tasksQuery = useApiResource(() => tasksService.list({ limit: 50 }), []);
  const tasks = useMemo(() => {
    const rows = listFromEnvelope(tasksQuery.data);
    return rows.map((row) => ({
      id: row.task_id || row.taskId,
      title: row.title,
      status: normalizeTaskStatus(row.status),
      statusLabel: taskStatusLabel(row.status),
      priority: row.priority || 'MEDIUM',
      description: row.description || '',
      deadline: row.deadline || '',
    }));
  }, [tasksQuery.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>My Tasks</Text>
      <Text style={styles.sub}>Track and manage your daily work items</Text>

      <AsyncState
        loading={tasksQuery.loading}
        error={tasksQuery.error}
        empty={!tasks.length}
        onRetry={tasksQuery.reload}
      >
        {tasks.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('TaskDetail', {
                taskId: t.id,
                title: t.title,
                task: t,
              })
            }
          >
            <View style={styles.row}>
              <Text style={styles.title}>{t.title}</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: `${getStatusColor(t.status)}20` },
                ]}
              >
                <Text style={[styles.badgeText, { color: getStatusColor(t.status) }]}>
                  {t.statusLabel}
                </Text>
              </View>
            </View>
            <Text style={styles.meta}>Priority: {t.priority}</Text>
          </TouchableOpacity>
        ))}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#020617' },
  h1: { fontSize: 30, fontWeight: '800', color: '#FFFFFF' },
  sub: { fontSize: 14, color: '#94A3B8', marginTop: 6, marginBottom: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: '#E2E8F0', flex: 1, paddingRight: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '800' },
  meta: { marginTop: 8, fontSize: 12, color: '#94A3B8' },
});

export default MyTasksScreen;
