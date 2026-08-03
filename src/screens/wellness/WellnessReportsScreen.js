import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { wellnessService } from '../../services/wellness/wellness.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const WellnessReportsScreen = () => {
  const wellness = useApiResource(() => wellnessService.listMine({ limit: 14 }), []);
  const summary = useMemo(() => {
    const rows = listFromEnvelope(wellness.data);
    const latest = rows[0];
    return {
      mood: latest?.mood || 'Unknown',
      count: rows.length,
      insight:
        rows.length > 2
          ? `You logged wellness ${rows.length} times recently. Keep consistency to improve AI suggestions.`
          : 'Log a few more mood entries to unlock richer wellness insights.',
    };
  }, [wellness.data]);
  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Wellness Insights</Text>

    <Text style={styles.sub}>
      AI-generated summary of your productivity and well-being patterns
    </Text>

    {/* Weekly Summary */}
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Summary</Text>
      <Text style={styles.subtitle}>Latest mood: {summary.mood}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{summary.mood.toUpperCase()}</Text>
      </View>

      <Text style={styles.muted}>
        Sleep tracking is not connected. Connect a wearable to improve insights.
      </Text>
    </View>

    {/* Focus Time */}
    <View style={styles.card}>
      <Text style={styles.title}>Deep Work Focus</Text>
      <Text style={styles.subtitle}>{summary.count} logs tracked recently</Text>

      <View style={styles.barBg}>
        <View style={styles.barFill} />
      </View>

      <Text style={styles.muted}>Within healthy productivity range</Text>
    </View>

    {/* AI Insight */}
    <View style={styles.card}>
      <Text style={styles.title}>AI Insight</Text>
      <Text style={styles.subtitle}>Personal recommendation</Text>

      <Text style={styles.insight}>
        {summary.insight}
      </Text>
    </View>
    <AsyncState loading={wellness.loading} error={wellness.error} onRetry={wellness.reload} />
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
    lineHeight: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 10,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },

  badgeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },

  muted: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginTop: 8,
  },

  barBg: {
    height: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },

  barFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#0F766E',
  },

  insight: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default WellnessReportsScreen;