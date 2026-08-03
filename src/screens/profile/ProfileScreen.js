import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { resetToLogin } from '../../navigation/navigationRef';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { commonStyles } from '../../theme/commonStyles';

const ProfileCard = ({ title, subtitle, onPress }) => (
  <TouchableOpacity style={commonStyles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={commonStyles.cardTitle}>{title}</Text>
        <Text style={commonStyles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { signOut } = useAuth();

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={commonStyles.screenTitle}>Profile</Text>
      <Text style={commonStyles.screenSubtitle}>
        Manage your account, privacy, and preferences
      </Text>

      <View style={styles.section}>
        <Text style={commonStyles.sectionLabel}>Account</Text>
        <ProfileCard
          title="Edit Profile"
          subtitle="Name, role, contact"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <ProfileCard
          title="Change Password"
          subtitle="Update your login security"
          onPress={() => navigation.navigate('ProfileChangePassword')}
        />
        <ProfileCard
          title="Device Information"
          subtitle="Connected devices & sessions"
          onPress={() => navigation.navigate('DeviceInformation')}
        />
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.sectionLabel}>Work</Text>
        <ProfileCard
          title="Projects"
          subtitle="Active assignments"
          onPress={() => navigation.navigate('ProjectList')}
        />
        <ProfileCard
          title="Goals"
          subtitle="Progress & deadlines"
          onPress={() => navigation.navigate('MyGoals')}
        />
        <ProfileCard
          title="Payroll"
          subtitle="Salary & payments"
          onPress={() => navigation.navigate('SalarySummary')}
        />
        <ProfileCard
          title="Compliance"
          subtitle="My violations"
          onPress={() => navigation.navigate('MyViolations')}
        />
        <ProfileCard
          title="Performance"
          subtitle="My reviews"
          onPress={() => navigation.navigate('MyReviews')}
        />
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.sectionLabel}>Wellness</Text>
        <ProfileCard
          title="Mood Tracker"
          subtitle="Daily check-ins"
          onPress={() => navigation.navigate('MoodSubmission')}
        />
        <ProfileCard
          title="Reports"
          subtitle="Performance & wellbeing insights"
          onPress={() => navigation.navigate('WellnessReports')}
        />
        <ProfileCard
          title="Burnout Alerts"
          subtitle="Risk detection system"
          onPress={() => navigation.navigate('BurnoutAlerts')}
        />
        <ProfileCard
          title="AI Suggestions"
          subtitle="Personalized recommendations"
          onPress={() => navigation.navigate('AIWellnessSuggestions')}
        />
      </View>

      <View style={styles.section}>
        <Text style={commonStyles.sectionLabel}>Learning</Text>
        <ProfileCard
          title="Courses"
          subtitle="Recommended learning paths"
          onPress={() => navigation.navigate('RecommendedCourses')}
        />
        <ProfileCard
          title="Enrolled Courses"
          subtitle="Continue your learning"
          onPress={() => navigation.navigate('EnrolledCourses')}
        />
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
    paddingTop: 8,
  },
  section: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    paddingRight: 8,
  },
  logout: {
    marginTop: 6,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '800',
  },
});

export default ProfileScreen;
