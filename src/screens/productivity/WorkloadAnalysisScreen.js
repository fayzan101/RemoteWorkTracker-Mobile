import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { analyticsService } from '../../services/analytics/analytics.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const WorkloadAnalysisScreen = () => {
  const productivity = useApiResource(() => analyticsService.productivity({ limit: 30 }), []);
  const team = useApiResource(() => analyticsService.teamPerformance({ limit: 30 }), []);

  const productivityRows = useMemo(() => {
    const rows = listFromEnvelope(productivity.data);
    return rows.map((r, i) => ({
      id: r.userId || r.user_id || String(i),
      name: 'You',
      score: r.productivityScore ?? r.completionRate ?? '—',
      label: `${r.tasksCompleted ?? 0} tasks completed`,
    }));
  }, [productivity.data]);

  const teamRows = useMemo(() => {
    const rows = listFromEnvelope(team.data);
    return rows.map((r, i) => ({
      id: r.userId || r.user_id || String(i),
      name: 'You',
      score: r.goalProgress ?? r.completionRate ?? '—',
      label: `${r.tasksAssigned ?? 0} assigned · ${r.tasksCompleted ?? 0} done`,
    }));
  }, [team.data]);

  const loading = productivity.loading || team.loading;
  const error = productivity.error || team.error;

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Workload Analysis</Text>
      <Text style={styles.sub}>Your productivity and goal progress (self-scoped)</Text>

      <AsyncState
        loading={loading}
        error={error}
        empty={!productivityRows.length && !teamRows.length}
        onRetry={() => {
          productivity.reload();
          team.reload();
        }}
      >
        <Text style={styles.section}>Productivity</Text>
        {productivityRows.map((row) => (
          <View key={`p-${row.id}`} style={styles.card}>
            <Text style={styles.title}>{row.name}</Text>
            <Text style={styles.meta}>{row.label}</Text>
            <Text style={styles.score}>Score: {String(row.score)}</Text>
          </View>
        ))}

        <Text style={[styles.section, { marginTop: 18 }]}>Goals & completion</Text>
        {teamRows.map((row) => (
          <View key={`t-${row.id}`} style={styles.card}>
            <Text style={styles.title}>{row.name}</Text>
            <Text style={styles.meta}>{row.label}</Text>
            <Text style={styles.score}>Goal progress: {String(row.score)}</Text>
          </View>
        ))}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 20, lineHeight: 20 },
  section: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  meta: { marginTop: 6, fontSize: 13, color: '#64748B' },
  score: { marginTop: 8, color: '#0F766E', fontWeight: '700', fontSize: 14 },
});

export default WorkloadAnalysisScreen;
