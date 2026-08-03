import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { learningService } from '../../services/learning/learning.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';
import { useAuth } from '../../context/AuthContext';

const RecommendedCoursesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const coursesQuery = useApiResource(() => learningService.listCourses({ limit: 20 }), []);
  const [enrollingId, setEnrollingId] = useState(null);

  const courses = useMemo(() => {
    const rows = listFromEnvelope(coursesQuery.data);
    return rows.map((c) => ({
      id: c.course_id || c.courseId,
      title: c.title,
      duration: c.duration ? `${c.duration} min` : 'Self paced',
      level: c.level || 'All levels',
    }));
  }, [coursesQuery.data]);

  const enroll = async (course) => {
    if (!course.id) {
      Alert.alert('Enroll', 'Course id missing.');
      return;
    }
    const userId = user?.userId || user?.user_id || user?.id;
    if (!userId) {
      Alert.alert('Enroll', 'Sign in again to enroll.');
      return;
    }
    setEnrollingId(course.id);
    try {
      await learningService.enroll(course.id, { userId });
      Alert.alert('Enrolled', `You are now enrolled in ${course.title}`);
      navigation.navigate('EnrolledCourses');
    } catch (err) {
      if (/already enrolled/i.test(err?.message || '')) {
        Alert.alert('Already enrolled', `You are already enrolled in ${course.title}`);
        navigation.navigate('EnrolledCourses');
        return;
      }
      Alert.alert('Enroll failed', err?.message || 'Could not enroll');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Recommended Learning</Text>

      <Text style={styles.sub}>
        Personalized courses based on your role and productivity patterns
      </Text>

      {courses.map((c) => (
        <TouchableOpacity
          key={c.id || c.title}
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => enroll(c)}
          disabled={Boolean(enrollingId)}
        >
          <View style={styles.topRow}>
            <Text style={styles.title}>{c.title}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{c.level}</Text>
            </View>
          </View>

          <Text style={styles.meta}>⏱ {c.duration}</Text>

          {enrollingId === c.id ? (
            <ActivityIndicator color="#0F766E" style={{ marginTop: 10 }} />
          ) : (
            <Text style={styles.cta}>Start learning →</Text>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.viewAll}
        onPress={() => navigation.navigate('EnrolledCourses')}
      >
        <Text style={styles.viewAllText}>View enrolled courses</Text>
      </TouchableOpacity>
      <AsyncState
        loading={coursesQuery.loading}
        error={coursesQuery.error}
        empty={!courses.length}
        onRetry={coursesQuery.reload}
      />
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
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 10,
  },

  badge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '700',
  },

  meta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 10,
  },

  cta: {
    marginTop: 10,
    color: '#0F766E',
    fontWeight: '700',
    fontSize: 14,
  },

  viewAll: {
    marginTop: 20,
    alignItems: 'center',
  },

  viewAllText: {
    color: '#0F766E',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default RecommendedCoursesScreen;
