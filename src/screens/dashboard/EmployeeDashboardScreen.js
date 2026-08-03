import React, { useMemo } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import SectionCard from '../../components/common/SectionCard/SectionCard';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { useApiResource } from '../../hooks/useApiResource';
import { analyticsService } from '../../services/analytics/analytics.service';
import { notificationsService } from '../../services/notifications/notifications.service';
import { attendanceService } from '../../services/attendance/attendance.service';
import {
  attendanceRowSeen,
  completionRateFromOverview,
  mapNotifications,
} from '../../services/api/helpers';
import { colors } from '../../theme/colors';
import { commonStyles } from '../../theme/commonStyles';

const EmployeeDashboardScreen = ({ navigation }) => {
  const attendance = useApiResource(() => attendanceService.myList({ limit: 14 }), []);
  const overview = useApiResource(() => analyticsService.overview({ days: 7 }), []);
  const notifications = useApiResource(() => notificationsService.list({ limit: 20 }), []);

  const todayAttendance = useMemo(() => {
    const list = Array.isArray(attendance.data?.attendanceLogs) ? attendance.data.attendanceLogs : [];
    return list[0];
  }, [attendance.data]);

  const productivityScore = completionRateFromOverview(overview.data);
  const unread = mapNotifications(notifications.data).filter((n) => !n.read).length;
  const { first: attendanceFirst } = attendanceRowSeen(todayAttendance);
  const loading = attendance.loading || overview.loading || notifications.loading;
  const error = attendance.error || overview.error || notifications.error;

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Remote Work Tracker</Text>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.sub}>
          Track productivity, tasks, and attendance in one place.
        </Text>
      </View>

      <AsyncState
        loading={loading}
        error={error}
        onRetry={() => {
          attendance.reload();
          overview.reload();
          notifications.reload();
        }}
      >
        <SectionCard
          accent
          title="Daily Attendance"
          subtitle={
            attendanceFirst
              ? `First activity · ${new Date(attendanceFirst).toLocaleTimeString()}`
              : 'No desk activity logged for the latest day in range'
          }
        >
          <View style={styles.rowBetween}>
            <Text style={styles.badge}>
              {todayAttendance?.firstSeen || attendanceFirst ? 'Active' : 'Pending'}
            </Text>
            <Text style={styles.smallText}>Today</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AttendanceTab', { screen: 'AttendanceHome' })
            }
          >
            <Text style={styles.link}>Attendance & Device Pairing →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard
          title="Working Hours"
          subtitle={`Today · ${Math.round(((todayAttendance?.activeSeconds || 0) / 3600) * 10) / 10}h`}
        >
          <Text style={styles.muted}>
            Target: 8h · Idle: {Math.round(((todayAttendance?.idleSeconds || 0) / 60) * 10) / 10}m
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    100,
                    Math.round(((todayAttendance?.activeSeconds || 0) / 28800) * 100),
                  )}%`,
                },
              ]}
            />
          </View>
        </SectionCard>

        <SectionCard
          title="Tasks Overview"
          subtitle={`Completion this week · ${Math.round(productivityScore)}%`}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('TasksTab', { screen: 'MyTasks' })}
          >
            <Text style={styles.link}>View My Tasks →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Productivity Score" subtitle="Last 7 days">
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{Math.round(productivityScore)}%</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProductivityScore')}>
            <Text style={styles.link}>AI Insights →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Notifications" subtitle={`${unread} unread`}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NotificationsTab', { screen: 'NotificationCenter' })
            }
          >
            <Text style={styles.link}>Open Notification Center →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Learning" subtitle="Recommended courses from backend">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileTab', { screen: 'RecommendedCourses' })
            }
          >
            <Text style={styles.link}>Browse Learning →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Payroll" subtitle="Salary & Payslips">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileTab', { screen: 'SalarySummary' })
            }
          >
            <Text style={styles.link}>View Payroll →</Text>
          </TouchableOpacity>
        </SectionCard>
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  hero: {
    marginBottom: 8,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  greeting: {
    ...commonStyles.screenTitle,
    marginBottom: 8,
  },
  sub: {
    ...commonStyles.screenSubtitle,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    ...commonStyles.badge,
  },
  smallText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  muted: {
    color: colors.textSecondary,
    marginBottom: 10,
  },
  progressBar: {
    ...commonStyles.progressTrack,
  },
  progressFill: {
    ...commonStyles.progressFill,
  },
  scoreContainer: {
    marginVertical: 4,
  },
  score: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -1,
  },
  link: {
    ...commonStyles.link,
  },
});

export default EmployeeDashboardScreen;
