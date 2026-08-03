import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useAuth } from '../../context/AuthContext';
import { useApiResource } from '../../hooks/useApiResource';
import { aiService } from '../../services/ai/ai.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { objectFromEnvelope } from '../../services/api/helpers';

const AISuggestionsScreen = () => {
  const { user } = useAuth();
  const userId = user?.user_id || user?.userId || user?.id;

  const reports = useApiResource(
    () => (userId ? aiService.weeklyReports(userId, { limit: 7 }) : Promise.resolve(null)),
    [userId],
  );

  const suggestions = useMemo(() => {
    const data = objectFromEnvelope(reports.data) || reports.data;
    const latest = data?.latest_report || data?.history?.[0];
    const recommendations = latest?.recommendations;
    if (Array.isArray(recommendations) && recommendations.length > 0) return recommendations;
    return [
      'No AI insights yet. Keep completing tasks and attendance records to build better recommendations.',
    ];
  }, [reports.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>AI Productivity Suggestions</Text>

    <Text style={styles.sub}>
      Based on your focus patterns and recent activity
    </Text>

    {suggestions.map((s, i) => (
      <View key={i} style={styles.card}>
        <View style={styles.dot} />
        <Text style={styles.text}>{s}</Text>
      </View>
    ))}
      <AsyncState loading={reports.loading} error={reports.error} onRetry={reports.reload} />
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F1F5F9',
  },

  h1: {
    fontSize: 28,
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
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',

    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F766E',
    marginTop: 6,
    marginRight: 10,
  },

  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#0F172A',
  },
});

export default AISuggestionsScreen;