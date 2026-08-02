import React, { useMemo } from 'react';

import { Text, StyleSheet, View } from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { attendanceService } from '../../services/attendance/attendance.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';

const WorkingHoursSummaryScreen = () => {
  const attendance = useApiResource(() => attendanceService.myList({ limit: 30 }), []);
  const stats = useMemo(() => {
    const rows = Array.isArray(attendance.data?.attendanceLogs) ? attendance.data.attendanceLogs : [];
    const weekRows = rows.slice(0, 7);
    const weekSeconds = weekRows.reduce((sum, r) => sum + Number(r.activeSeconds || 0), 0);
    const daySeconds = Number(rows[0]?.activeSeconds || 0);
    const idleSeconds = Number(rows[0]?.idleSeconds || 0);
    return {
      weekHours: `${Math.floor(weekSeconds / 3600)}h ${Math.round((weekSeconds % 3600) / 60)}m`,
      dayHours: `${Math.floor(daySeconds / 3600)}h ${Math.round((daySeconds % 3600) / 60)}m`,
      idleMins: Math.round(idleSeconds / 60),
      weekProgress: `${Math.min(100, Math.round((weekSeconds / (40 * 3600)) * 100))}%`,
      dayProgress: `${Math.min(100, Math.round((daySeconds / (8 * 3600)) * 100))}%`,
    };
  }, [attendance.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Working Hours</Text>

    <Text style={styles.sub}>
      Track your weekly productivity and daily progress
    </Text>

    <AsyncState loading={attendance.loading} error={attendance.error} onRetry={attendance.reload}>
    {/* WEEK SUMMARY */}
    <View style={styles.card}>
      <Text style={styles.label}>This Week</Text>

      <Text style={styles.big}>
        {stats.weekHours}
      </Text>

      <Text style={styles.meta}>
        Target: 40h · Progress from live attendance logs
      </Text>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: stats.weekProgress }]} />
      </View>
    </View>

    {/* TODAY */}
    <View style={styles.card}>
      <Text style={styles.label}>Today</Text>

      <Text style={styles.big}>
        {stats.dayHours}
      </Text>

      <Text style={styles.meta}>
        Idle today: {stats.idleMins}m
      </Text>

      <View style={styles.barBg}>
        <View style={[styles.barFillToday, { width: stats.dayProgress }]} />
      </View>
    </View>
    </AsyncState>
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
  },

  sub: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 18,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  label: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
    marginBottom: 6,
  },

  big: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E2E8F0',
  },

  meta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 12,
  },

  barBg: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    backgroundColor: '#22C55E',
  },

  barFillToday: {
    height: '100%',
    backgroundColor: '#60A5FA',
  },
});

export default WorkingHoursSummaryScreen;