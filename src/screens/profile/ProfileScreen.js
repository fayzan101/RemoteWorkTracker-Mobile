import React from 'react';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { resetToLogin } from '../../navigation/navigationRef';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { signOut } = useAuth();

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Profile</Text>

      <Text style={styles.sub}>
        Manage your account, privacy, and preferences
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Name, role, contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ProfileChangePassword')}
        >
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Update your login security</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DeviceInformation')}
        >
          <Text style={styles.title}>Device Information</Text>
          <Text style={styles.subtitle}>Connected devices & sessions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ProjectList')}
        >
          <Text style={styles.title}>Projects</Text>
          <Text style={styles.subtitle}>Active assignments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('MyGoals')}
        >
          <Text style={styles.title}>Goals</Text>
          <Text style={styles.subtitle}>Progress & deadlines</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SalarySummary')}
        >
          <Text style={styles.title}>Payroll</Text>
          <Text style={styles.subtitle}>Salary & payments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('MyViolations')}
        >
          <Text style={styles.title}>Compliance</Text>
          <Text style={styles.subtitle}>My violations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('MyReviews')}
        >
          <Text style={styles.title}>Performance</Text>
          <Text style={styles.subtitle}>My reviews</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellness</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('MoodSubmission')}
        >
          <Text style={styles.title}>Mood Tracker</Text>
          <Text style={styles.subtitle}>Daily check-ins</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('WellnessReports')}
        >
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>Performance & wellbeing insights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('BurnoutAlerts')}
        >
          <Text style={styles.title}>Burnout Alerts</Text>
          <Text style={styles.subtitle}>Risk detection system</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AIWellnessSuggestions')}
        >
          <Text style={styles.title}>AI Suggestions</Text>
          <Text style={styles.subtitle}>Personalized recommendations</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('RecommendedCourses')}
        >
          <Text style={styles.title}>Courses</Text>
          <Text style={styles.subtitle}>Recommended learning paths</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EnrolledCourses')}
        >
          <Text style={styles.title}>Enrolled Courses</Text>
          <Text style={styles.subtitle}>Continue your learning</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={() =>
          Alert.alert('Logout', 'Sign out from this device?', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                await signOut();
                resetToLogin();
              },
            },
          ])
        }
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#60A5FA',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E2E8F0',
  },

  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },

  logout: {
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    alignItems: 'center',
  },

  logoutText: {
    color: '#EF4444',
    fontWeight: '800',
  },
});

export default ProfileScreen;