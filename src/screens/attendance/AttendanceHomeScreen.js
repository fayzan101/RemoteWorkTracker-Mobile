import React, { useMemo } from 'react';

import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { attendanceService } from '../../services/attendance/attendance.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { attendanceRowSeen } from '../../services/api/helpers';

const AttendanceHomeScreen = ({ navigation }) => {
  const attendance = useApiResource(() => attendanceService.myList({ limit: 14 }), []);
  const summary = useMemo(() => {
    const rows = Array.isArray(attendance.data?.attendanceLogs) ? attendance.data.attendanceLogs : [];
    const latest = rows[0];
    const { first } = attendanceRowSeen(latest);
    return {
      latestLabel: first ? `Last activity ${new Date(first).toLocaleString()}` : 'No desk activity logged yet',
      totalHours: Math.round((rows.reduce((sum, r) => sum + Number(r.activeSeconds || 0), 0) / 3600) * 10) / 10,
    };
  }, [attendance.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Attendance</Text>

    <Text style={styles.sub}>
      Manage your check-ins, device pairing, and working hours
    </Text>

    <AsyncState loading={attendance.loading} error={attendance.error} onRetry={attendance.reload}>
    {/* PRIMARY ACTION */}
    <TouchableOpacity
      style={styles.primaryCard}
      onPress={() => navigation.navigate('CheckInOut')}
    >
      <Text style={styles.primaryTitle}>Check In / Out</Text>
      <Text style={styles.primarySub}>
        Location-based attendance · {summary.latestLabel}
        {summary.totalHours > 0 ? ` · ${summary.totalHours}h in last logs` : ''}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DevicePairing')}
    >
      <Text style={styles.title}>Device Pairing</Text>
      <Text style={styles.subText}>Generate secure code for desktop agent</Text>
    </TouchableOpacity>

    {/* SECONDARY SECTION */}
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AttendanceHistory')}
    >
      <Text style={styles.title}>Attendance History</Text>
      <Text style={styles.subText}>View daily check-in records</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AttendanceCalendar')}
    >
      <Text style={styles.title}>Monthly Calendar</Text>
      <Text style={styles.subText}>Visual attendance tracking</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('WorkingHoursSummary')}
    >
      <Text style={styles.title}>Working Hours</Text>
      <Text style={styles.subText}>Daily and monthly summary</Text>
    </TouchableOpacity>
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

  /* PRIMARY CARD (important action) */
  primaryCard: {
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.4)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  primaryTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#22C55E',
  },

  primarySub: {
    fontSize: 13,
    color: '#86EFAC',
    marginTop: 4,
  },

  /* SECONDARY CARDS */
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E2E8F0',
  },

  subText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
});

export default AttendanceHomeScreen;