import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { tasksService } from '../../services/tasks/tasks.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope, normalizeTaskStatus, taskStatusLabel } from '../../services/api/helpers';
import { colors } from '../../theme/colors';
import { commonStyles } from '../../theme/commonStyles';

const getStatusColor = (status) => {
  const value = normalizeTaskStatus(status);
  if (value === 'COMPLETED') return colors.success;
  if (value === 'IN_PROGRESS') return colors.warning;
  return colors.primary;
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
      <Text style={commonStyles.screenTitle}>My Tasks</Text>
      <Text style={commonStyles.screenSubtitle}>
        Track and manage your daily work items
      </Text>

      <AsyncState
        loading={tasksQuery.loading}
        error={tasksQuery.error}
        empty={!tasks.length}
        onRetry={tasksQuery.reload}
      >
        {tasks.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={commonStyles.card}
            onPress={() =>
              navigation.navigate('TaskDetail', {
                taskId: t.id,
                title: t.title,
                task: t,
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.row}>
              <Text style={styles.title}>{t.title}</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: `${getStatusColor(t.status)}22` },
                ]}
              >
                <Text style={[styles.badgeText, { color: getStatusColor(t.status) }]}>
                  {t.statusLabel}
                </Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Priority: {t.priority}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    paddingRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default MyTasksScreen;
