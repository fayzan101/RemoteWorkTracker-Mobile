import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useAuth } from '../../context/AuthContext';
import { useApiResource } from '../../hooks/useApiResource';
import { aiService } from '../../services/ai/ai.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { objectFromEnvelope } from '../../services/api/helpers';

const AIWellnessSuggestionsScreen = () => {
  const { user } = useAuth();
  const userId = user?.user_id || user?.userId || user?.id;
  const reports = useApiResource(
    () => (userId ? aiService.weeklyReports(userId, { limit: 5 }) : Promise.resolve(null)),
    [userId],
  );
  const tips = useMemo(() => {
    const payload = objectFromEnvelope(reports.data) || reports.data || {};
    const latest = payload?.latest_report;
    const recs = latest?.recommendations;
    if (!Array.isArray(recs) || !recs.length) {
      return [
        { icon: 'sparkles-outline', title: 'Collecting Insights', text: 'Complete more attendance and task activity to receive personalized wellness suggestions.', color: '#3B82F6' },
      ];
    }
    return recs.map((text, idx) => ({
      icon: idx % 2 ? 'calendar-outline' : 'timer-outline',
      title: `Suggestion ${idx + 1}`,
      text,
      color: idx % 2 ? '#8B5CF6' : '#3B82F6',
    }));
  }, [reports.data]);
  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={18} color="#fff" />
        </View>

        <Text style={styles.h1}>AI Wellness Tips</Text>

        <Text style={styles.muted}>
          Personalized insights based on productivity, attendance, and wellness patterns
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>92%</Text>
          <Text style={styles.statLabel}>Focus</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>Good</Text>
          <Text style={styles.statLabel}>Energy</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>7.5h</Text>
          <Text style={styles.statLabel}>Balance</Text>
        </View>
      </View>

      {/* Tips */}
      {tips.map((tip) => (
        <View key={tip.title} style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: tip.color }]}>
            <Ionicons name={tip.icon} size={22} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{tip.title}</Text>
            <Text style={styles.text}>{tip.text}</Text>
          </View>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="heart" size={18} color="#EF4444" />
        <Text style={styles.footerText}>
          Small habits consistently improve productivity and mental wellness.
        </Text>
      </View>
      <AsyncState loading={reports.loading} error={reports.error} onRetry={reports.reload} />
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#020617',
  },

  header: {
    marginBottom: 20,
  },

  aiBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },

  muted: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 20,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E2E8F0',
  },

  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },

  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 4,
  },

  text: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },

  footerText: {
    marginLeft: 8,
    color: '#FCA5A5',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});

export default AIWellnessSuggestionsScreen;