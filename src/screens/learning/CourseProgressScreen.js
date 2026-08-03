import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { learningService } from '../../services/learning/learning.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope, objectFromEnvelope } from '../../services/api/helpers';

const CourseProgressScreen = ({ route }) => {
  const title = route.params?.title ?? 'Course';
  const courseId = route.params?.courseId;
  const progressParam = Number(route.params?.progress);
  const courseQuery = useApiResource(
    () => (courseId ? learningService.getById(courseId) : learningService.listEnrollments({ limit: 50 })),
    [courseId],
  );

  const progress = useMemo(() => {
    if (Number.isFinite(progressParam)) return Math.max(0, Math.min(100, Math.round(progressParam)));
    if (!courseId) {
      const rows = listFromEnvelope(courseQuery.data);
      const match = rows.find((r) => (r.title || r.course_title) === title);
      return Math.round(Number(match?.progress || 0));
    }
    const detail = objectFromEnvelope(courseQuery.data) || courseQuery.data || {};
    return Math.round(Number(detail.progress || 0));
  }, [courseQuery.data, title, courseId, progressParam]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.sub}>Enrollment progress from the learning API</Text>

      <AsyncState
        loading={courseQuery.loading}
        error={courseQuery.error}
        onRetry={courseQuery.reload}
      >
        <Text style={styles.progressText}>{progress}% Complete</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.note}>
          Detailed module breakdown is not provided by the API yet. This screen shows the
          enrollment progress percentage only.
        </Text>
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 30, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 16 },
  progressText: { fontSize: 14, fontWeight: '700', color: '#0F766E', marginBottom: 10 },
  barBg: {
    height: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 20,
  },
  barFill: { height: '100%', backgroundColor: '#0F766E' },
  note: { fontSize: 13, color: '#64748B', lineHeight: 20 },
});

export default CourseProgressScreen;
