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
      <Text style={styles.greeting}>Welcome Back</Text>
      <Text style={styles.sub}>
        Track productivity, tasks and attendance seamlessly.
      </Text>

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
          title="Daily Attendance"
          subtitle={
            attendanceFirst
              ? `First activity · ${new Date(attendanceFirst).toLocaleTimeString()}`
              : 'No desk activity logged for the latest day in range'
          }
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.badge}>{todayAttendance?.firstSeen || attendanceFirst ? 'Active' : 'Pending'}</Text>
            <Text style={styles.smallText}>Today</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AttendanceTab', {
                screen: 'AttendanceHome',
              })
            }
          >
            <Text style={styles.link}>Attendance & Device Pairing →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard
          title="Working Hours"
          subtitle={`Today · ${Math.round(((todayAttendance?.activeSeconds || 0) / 3600) * 10) / 10}h`}
          style={styles.card}
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
          style={styles.card}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TasksTab', {
                screen: 'MyTasks',
              })
            }
          >
            <Text style={styles.link}>View My Tasks →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Productivity Score" subtitle="Last 7 days" style={styles.card}>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{Math.round(productivityScore)}%</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProductivityScore')}>
            <Text style={styles.link}>AI Insights →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Notifications" subtitle={`${unread} unread`} style={styles.card}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NotificationsTab', {
                screen: 'NotificationCenter',
              })
            }
          >
            <Text style={styles.link}>Open Notification Center →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard
          title="Learning"
          subtitle="Recommended courses from backend"
          style={styles.card}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileTab', {
                screen: 'RecommendedCourses',
              })
            }
          >
            <Text style={styles.link}>Browse Learning →</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title="Payroll" subtitle="Salary & Payslips" style={styles.card}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileTab', {
                screen: 'SalarySummary',
              })
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
    padding: 20,
    backgroundColor: '#020617',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sub: {
    fontSize: 16,
    lineHeight: 24,
    color: '#94A3B8',
    marginBottom: 28,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
    padding: 18,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    color: '#22C55E',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '700',
    fontSize: 13,
  },
  smallText: {
    color: '#94A3B8',
  },
  muted: {
    color: '#94A3B8',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  scoreContainer: {
    marginVertical: 8,
  },
  score: {
    fontSize: 42,
    fontWeight: '900',
    color: '#3B82F6',
  },
  link: {
    marginTop: 12,
    color: '#60A5FA',
    fontWeight: '700',
  },
});

export default EmployeeDashboardScreen;
