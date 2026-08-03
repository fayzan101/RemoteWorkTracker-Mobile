import React, { useMemo } from 'react';

import { Text, StyleSheet, View } from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { attendanceService } from '../../services/attendance/attendance.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { attendanceRowSeen } from '../../services/api/helpers';

const AttendanceHistoryScreen = () => {
  const attendance = useApiResource(() => attendanceService.myList({ limit: 30 }), []);
  const rows = useMemo(() => {
    const list = Array.isArray(attendance.data?.attendanceLogs) ? attendance.data.attendanceLogs : [];
    return list.map((r) => {
      const { first, last } = attendanceRowSeen(r);
      const day = r.day || (first ? new Date(first).toLocaleDateString() : '');
      const checkIn = first ? new Date(first).toLocaleTimeString() : '—';
      const checkOut = last ? new Date(last).toLocaleTimeString() : '—';
      const status =
        !first && Number(r.idleSeconds || 0) > 0
          ? 'Idle only'
          : !first
            ? 'Open'
            : Number(r.activeSeconds || 0) >= 8 * 3600
              ? 'Complete'
              : 'In Progress';
      return { key: `${r.day || day}-${r.attendanceId || r.attendance_id || ''}`, day, in: checkIn, out: checkOut, status };
    });
  }, [attendance.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Attendance History</Text>

    <Text style={styles.sub}>
      Your daily check-in and working time logs
    </Text>

    <AsyncState
      loading={attendance.loading}
      error={attendance.error}
      empty={!attendance.loading && !rows.length}
      onRetry={attendance.reload}
    >
    {rows.map((r) => (
      <View key={r.key} style={styles.card}>
        <View style={styles.left}>
          <Text style={styles.day}>{r.day}</Text>

          <Text style={styles.time}>
            In: {r.in}  •  Out: {r.out}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            r.status === 'Complete' && styles.complete,
            r.status === 'Open' && styles.open,
            r.status === 'Late in' && styles.late,
          ]}
        >
          <Text style={styles.badgeText}>{r.status}</Text>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  left: {
    flex: 1,
  },

  day: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  time: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  /* STATUS BADGES */
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },

  complete: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },

  open: {
    backgroundColor: 'rgba(148,163,184,0.15)',
  },

  late: {
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
});

export default AttendanceHistoryScreen;