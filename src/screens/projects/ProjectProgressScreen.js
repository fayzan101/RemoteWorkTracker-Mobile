import React, { useMemo } from 'react';

import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { tasksService } from '../../services/tasks/tasks.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const ProjectProgressScreen = ({ route }) => {
  const projectId = route.params?.projectId;
  const tasksQuery = useApiResource(
    () => (projectId ? tasksService.list({ projectId, limit: 100 }) : Promise.resolve({ data: [] })),
    [projectId],
  );
  const stats = useMemo(() => {
    const rows = listFromEnvelope(tasksQuery.data);
    const total = rows.length || 1;
    const completed = rows.filter((r) => String(r.status || '').toLowerCase() === 'done').length;
    const pct = Math.round((completed / total) * 100);
    return { pct, remaining: 100 - pct, status: pct >= 60 ? 'On Track' : 'Needs Attention' };
  }, [tasksQuery.data]);
  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Project Progress</Text>

    <Text style={styles.pct}>{stats.pct}%</Text>

    <Text style={styles.muted}>
      Weighted by milestones · updated hourly
    </Text>

    <View style={styles.card}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${stats.pct}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <View>
          <Text style={styles.label}>Completed</Text>
          <Text style={styles.value}>{stats.pct}%</Text>
        </View>

        <View>
          <Text style={styles.label}>Remaining</Text>
          <Text style={styles.value}>{stats.remaining}%</Text>
        </View>

        <View>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.status}>{stats.status}</Text>
        </View>
      </View>
    </View>
    <AsyncState loading={tasksQuery.loading} error={tasksQuery.error} onRetry={tasksQuery.reload} />
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
    marginBottom: 10,
  },

  pct: {
    fontSize: 48,
    fontWeight: '900',
    color: '#3B82F6',
  },

  muted: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
    marginTop: 6,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 20,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  barBg: {
    height: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: 20,
  },

  barFill: {
    width: '62%',
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
  },

  status: {
    fontSize: 13,
    fontWeight: '800',
    color: '#22C55E',
  },
});

export default ProjectProgressScreen;