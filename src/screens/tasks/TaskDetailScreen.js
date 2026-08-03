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
import { objectFromEnvelope } from '../../services/api/helpers';

const TaskDetailScreen = ({ route, navigation }) => {
  const title = route.params?.title ?? 'Task';
  const taskId = route.params?.taskId;
  const taskQuery = useApiResource(
    () => (taskId ? tasksService.getById(taskId) : Promise.resolve(route.params?.task || null)),
    [taskId],
  );
  const task = useMemo(() => {
    const row = objectFromEnvelope(taskQuery.data) || taskQuery.data || route.params?.task;
    if (!row) return null;
    return {
      taskId: row.task_id || row.taskId || taskId,
      title: row.title || title,
      description: row.description || 'No description provided.',
      status: row.status || 'open',
      priority: row.priority || 'medium',
    };
  }, [route.params?.task, taskId, taskQuery.data, title]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>{task?.title || title}</Text>

      <Text style={styles.sub}>
        Task overview and actions
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Description</Text>

        <Text style={styles.body}>
          {task?.description}
        </Text>
        <Text style={[styles.body, { marginTop: 10 }]}>Status: {task?.status} · Priority: {task?.priority}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.primary]}
          onPress={() => navigation.navigate('UpdateTaskStatus', { taskId: task?.taskId, currentStatus: task?.status })}
        >
          <Text style={styles.btnTextOnPrimary}>Update Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.secondary]}
          onPress={() => navigation.navigate('TaskComments', { taskId: task?.taskId })}
        >
          <Text style={styles.btnText}>Comments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.secondary]}
          onPress={() => navigation.navigate('TaskAttachments', { taskId: task?.taskId })}
        >
          <Text style={styles.btnText}>Attachments</Text>
        </TouchableOpacity>
      </View>
      <AsyncState loading={taskQuery.loading} error={taskQuery.error} onRetry={taskQuery.reload} />
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
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },

  body: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 22,
  },

  actions: {
    gap: 12,
  },

  btn: {
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  primary: {
    backgroundColor: '#0F766E',
  },

  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  btnTextOnPrimary: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  btnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default TaskDetailScreen;