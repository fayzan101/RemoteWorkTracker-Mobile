import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { useApiResource } from '../../hooks/useApiResource';
import { performanceService } from '../../services/performance/performance.service';

const MyReviewsScreen = () => {
  const resource = useApiResource(() => performanceService.myReviews({ limit: 50 }), []);
  const rows = useMemo(() => {
    const list = Array.isArray(resource.data?.reviews) ? resource.data.reviews : [];
    return list.map((r) => ({
      key: r.reviewId || r.id || String(Math.random()),
      period: r.period || 'Period',
      status: r.status || 'DRAFT',
      score:
        r.overallScore != null
          ? `${Number(r.overallScore).toFixed(1)} overall`
          : 'Score pending',
      generatedAt: r.generatedAt ? new Date(r.generatedAt).toLocaleDateString() : '—',
    }));
  }, [resource.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>My Reviews</Text>
      <Text style={styles.sub}>Performance reviews for your account</Text>

      <AsyncState
        loading={resource.loading}
        error={resource.error}
        empty={!resource.loading && !rows.length}
        onRetry={resource.reload}
      >
        {rows.map((r) => (
          <View key={r.key} style={styles.card}>
            <Text style={styles.title}>{r.period}</Text>
            <Text style={styles.meta}>
              {r.status} · {r.score} · {r.generatedAt}
            </Text>
          </View>
        ))}
      </AsyncState>
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
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  meta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});

export default MyReviewsScreen;
