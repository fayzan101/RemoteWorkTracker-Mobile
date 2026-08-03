import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { learningService } from '../../services/learning/learning.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';
const EnrolledCoursesScreen = ({ navigation }) => {
  const enrollments = useApiResource(() => learningService.listEnrollments({ limit: 30 }), []);
  const courses = useMemo(() => {
    const rows = listFromEnvelope(enrollments.data);
    return rows.map((r) => ({
      title: r.title || r.course_title || 'Course',
      progress: Number(r.progress || 0),
      status: r.status || (Number(r.progress || 0) >= 100 ? 'Completed' : 'In progress'),
      enrollmentId: r.enrollment_id || r.enrollmentId,
      courseId: r.course_id || r.courseId,
    }));
  }, [enrollments.data]);
  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>My Learning</Text>

    <Text style={styles.sub}>
      Track your course progress and continue where you left off
    </Text>

    {courses.map((c) => (
      <TouchableOpacity
        key={c.enrollmentId || c.courseId || c.title}
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('CourseProgress', {
            title: c.title,
            courseId: c.courseId,
            enrollmentId: c.enrollmentId,
            progress: c.progress,
          })
        }
      >
        <View style={styles.topRow}>
          <Text style={styles.title}>{c.title}</Text>

          <View
            style={[
              styles.badge,
              c.progress === 100 ? styles.doneBadge : styles.progressBadge,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                c.progress === 100 ? styles.doneText : styles.progressText,
              ]}
            >
              {c.progress === 100 ? 'DONE' : `${c.progress}%`}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${c.progress}%` }]} />
        </View>

        <Text style={styles.meta}>{c.status}</Text>
      </TouchableOpacity>
    ))}
    <AsyncState loading={enrollments.loading} error={enrollments.error} empty={!courses.length} onRetry={enrollments.reload} />

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
    marginBottom: 20,
    lineHeight: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  progressBadge: {
    backgroundColor: 'rgba(56,189,248,0.15)',
  },

  doneBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  progressText: {
    color: '#0F766E',
  },

  doneText: {
    color: '#10B981',
  },

  barBg: {
    height: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },

  barFill: {
    height: '100%',
    backgroundColor: '#0F766E',
  },

  meta: {
    fontSize: 13,
    color: '#64748B',
  },
});

export default EnrolledCoursesScreen;