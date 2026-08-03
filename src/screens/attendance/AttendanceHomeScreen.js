import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { attendanceService } from '../../services/attendance/attendance.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { attendanceRowSeen } from '../../services/api/helpers';
import { colors } from '../../theme/colors';
import { commonStyles } from '../../theme/commonStyles';

const MenuRow = ({ icon, title, subtitle, onPress, accent }) => (
  <TouchableOpacity
    style={[commonStyles.card, accent && styles.primaryCard]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.row}>
      <View style={[styles.iconWrap, accent && styles.iconWrapAccent]}>
        <Ionicons
          name={icon}
          size={20}
          color={accent ? colors.primary : colors.primaryDark}
        />
      </View>
      <View style={styles.rowText}>
        <Text style={[commonStyles.cardTitle, accent && styles.primaryTitle]}>
          {title}
        </Text>
        <Text style={[commonStyles.cardSubtitle, accent && styles.primarySub]}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const AttendanceHomeScreen = ({ navigation }) => {
  const attendance = useApiResource(() => attendanceService.myList({ limit: 14 }), []);
  const summary = useMemo(() => {
    const rows = Array.isArray(attendance.data?.attendanceLogs)
      ? attendance.data.attendanceLogs
      : [];
    const latest = rows[0];
    const { first } = attendanceRowSeen(latest);
    return {
      latestLabel: first
        ? `Last activity ${new Date(first).toLocaleString()}`
        : 'No desk activity logged yet',
      totalHours:
        Math.round(
          (rows.reduce((sum, r) => sum + Number(r.activeSeconds || 0), 0) / 3600) * 10,
        ) / 10,
    };
  }, [attendance.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={commonStyles.screenTitle}>Attendance</Text>
      <Text style={commonStyles.screenSubtitle}>
        Manage check-ins, device pairing, and working hours
      </Text>

      <AsyncState
        loading={attendance.loading}
        error={attendance.error}
        onRetry={attendance.reload}
      >
        <MenuRow
          accent
          icon="locate-outline"
          title="Check In / Out"
          subtitle={`Location-based attendance · ${summary.latestLabel}${
            summary.totalHours > 0 ? ` · ${summary.totalHours}h in last logs` : ''
          }`}
          onPress={() => navigation.navigate('CheckInOut')}
        />
        <MenuRow
          icon="phone-portrait-outline"
          title="Device Pairing"
          subtitle="Generate secure code for desktop agent"
          onPress={() => navigation.navigate('DevicePairing')}
        />
        <MenuRow
          icon="time-outline"
          title="Attendance History"
          subtitle="View daily check-in records"
          onPress={() => navigation.navigate('AttendanceHistory')}
        />
        <MenuRow
          icon="calendar-outline"
          title="Monthly Calendar"
          subtitle="Visual attendance tracking"
          onPress={() => navigation.navigate('AttendanceCalendar')}
        />
        <MenuRow
          icon="stats-chart-outline"
          title="Working Hours"
          subtitle="Daily and monthly summary"
          onPress={() => navigation.navigate('WorkingHoursSummary')}
        />
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapAccent: {
    backgroundColor: '#FFFFFF',
  },
  rowText: {
    flex: 1,
    paddingRight: 8,
  },
  primaryCard: {
    backgroundColor: colors.primarySoft,
    borderColor: '#99F6E4',
  },
  primaryTitle: {
    color: colors.primaryDark,
  },
  primarySub: {
    color: '#0F766E',
  },
});

export default AttendanceHomeScreen;
