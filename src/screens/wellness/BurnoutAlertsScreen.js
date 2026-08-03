import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { analyticsService } from '../../services/analytics/analytics.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { completionRateFromOverview } from '../../services/api/helpers';

const BurnoutAlertsScreen = () => {
  const overview = useApiResource(() => analyticsService.overview({ days: 14 }), []);
  const alert = useMemo(() => {
    const completion = completionRateFromOverview(overview.data);
    if (completion < 55) {
      return {
        level: 'WATCH',
        tone: 'warning',
        text: `Task completion is about ${completion}% over the last 14 days. Consider reducing context-switching and planning focused blocks.`,
      };
    }
    return {
      level: 'OK',
      tone: 'ok',
      text: `Task completion is about ${completion}% over the last 14 days. Keep breaks and workload pacing consistent.`,
    };
  }, [overview.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Stress & Burnout Alerts</Text>
      <Text style={styles.sub}>
        Derived from your recent task completion trend (not a clinical assessment)
      </Text>

      <AsyncState loading={overview.loading} error={overview.error} onRetry={overview.reload}>
        <View
          style={[
            styles.card,
            alert.tone === 'warning' ? styles.warningCard : styles.okCard,
          ]}
        >
          <View style={alert.tone === 'warning' ? styles.badgeWarn : styles.badgeOk}>
            <Text
              style={alert.tone === 'warning' ? styles.badgeTextWarn : styles.badgeTextOk}
            >
              {alert.level}
            </Text>
          </View>
          <Text style={styles.msg}>{alert.text}</Text>
        </View>
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 20, lineHeight: 20 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 14 },
  warningCard: {
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  okCard: {
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
  badgeWarn: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeOk: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeTextWarn: { color: '#0F172A', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  badgeTextOk: { color: '#0F172A', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  msg: { fontSize: 15, color: '#0F172A', lineHeight: 22, fontWeight: '500' },
});

export default BurnoutAlertsScreen;
