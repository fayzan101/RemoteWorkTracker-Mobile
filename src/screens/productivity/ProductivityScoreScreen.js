import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { analyticsService } from '../../services/analytics/analytics.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { completionRateFromOverview } from '../../services/api/helpers';

const ProductivityScoreScreen = ({ navigation }) => {
  const overview = useApiResource(() => analyticsService.overview({ days: 7 }), []);
  const score = useMemo(() => completionRateFromOverview(overview.data), [overview.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Productivity Score</Text>

      <AsyncState loading={overview.loading} error={overview.error} onRetry={overview.reload}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.muted}>
          Rolling 7-day task completion from analytics overview
        </Text>

        <TouchableOpacity
          style={styles.cardLink}
          onPress={() => navigation.navigate('WeeklyPerformance')}
        >
          <Text style={styles.linkTitle}>Weekly Performance</Text>
          <Text style={styles.linkSub}>View graphs and trends →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardLink}
          onPress={() => navigation.navigate('AISuggestions')}
        >
          <Text style={styles.linkTitle}>AI Suggestions</Text>
          <Text style={styles.linkSub}>Improve focus and balance →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardLink}
          onPress={() => navigation.navigate('WorkloadAnalysis')}
        >
          <Text style={styles.linkTitle}>Workload Analysis</Text>
          <Text style={styles.linkSub}>Check capacity & risk →</Text>
        </TouchableOpacity>
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  score: { fontSize: 64, fontWeight: '900', color: '#0F766E', marginVertical: 10 },
  muted: { fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 20 },
  cardLink: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  linkTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  linkSub: { fontSize: 13, color: '#64748B' },
});

export default ProductivityScoreScreen;
