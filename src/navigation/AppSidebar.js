import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSidebar } from './SidebarContext';
import { resetToLogin, navigationRef } from './navigationRef';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', icon: 'home-outline', tab: 'HomeTab', screen: 'EmployeeDashboard' },
      { label: 'My Tasks', icon: 'checkmark-circle-outline', tab: 'TasksTab', screen: 'MyTasks' },
      { label: 'Attendance', icon: 'calendar-outline', tab: 'AttendanceTab', screen: 'AttendanceHome' },
      { label: 'Notifications', icon: 'notifications-outline', tab: 'NotificationsTab', screen: 'NotificationCenter' },
      { label: 'Profile', icon: 'person-outline', tab: 'ProfileTab', screen: 'ProfileMain' },
    ],
  },
  {
    section: 'Work',
    items: [
      { label: 'Projects', icon: 'briefcase-outline', tab: 'ProfileTab', screen: 'ProjectList' },
      { label: 'Goals', icon: 'flag-outline', tab: 'ProfileTab', screen: 'MyGoals' },
      { label: 'Payroll', icon: 'wallet-outline', tab: 'ProfileTab', screen: 'SalarySummary' },
      { label: 'Performance', icon: 'trending-up-outline', tab: 'ProfileTab', screen: 'MyReviews' },
    ],
  },
  {
    section: 'Wellness & Learning',
    items: [
      { label: 'Mood Tracker', icon: 'happy-outline', tab: 'ProfileTab', screen: 'MoodSubmission' },
      { label: 'Wellness Tips', icon: 'leaf-outline', tab: 'ProfileTab', screen: 'AIWellnessSuggestions' },
      { label: 'Courses', icon: 'school-outline', tab: 'ProfileTab', screen: 'RecommendedCourses' },
    ],
  },
];

const AppSidebar = () => {
  const { open, closeSidebar } = useSidebar();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const displayName =
    user?.full_name || user?.fullName || user?.name || user?.email || 'Employee';
  const email = user?.email || '';

  const goTo = (tab, screen) => {
    closeSidebar();
    if (navigationRef.isReady()) {
      navigationRef.navigate('Main', {
        screen: tab,
        params: { screen },
      });
    }
  };

  const onLogout = () => {
    Alert.alert('Logout', 'Sign out from this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          closeSidebar();
          await signOut();
          resetToLogin();
        },
      },
    ]);
  };

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      onRequestClose={closeSidebar}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeSidebar} />

        <View style={[styles.drawer, { paddingTop: insets.top + 12 }]}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              accessibilityLabel="App logo"
            />
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>Remote Work Tracker</Text>
              <Text style={styles.brandSub}>Employee workspace</Text>
            </View>
            <Pressable onPress={closeSidebar} hitSlop={12} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {String(displayName).charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName} numberOfLines={1}>
                {displayName}
              </Text>
              {!!email && (
                <Text style={styles.userEmail} numberOfLines={1}>
                  {email}
                </Text>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {NAV_ITEMS.map((group) => (
              <View key={group.section} style={styles.section}>
                <Text style={styles.sectionLabel}>{group.section}</Text>
                {group.items.map((item) => (
                  <Pressable
                    key={item.label}
                    style={({ pressed }) => [
                      styles.navItem,
                      pressed && styles.navItemPressed,
                    ]}
                    onPress={() => goTo(item.tab, item.screen)}
                  >
                    <View style={styles.navIcon}>
                      <Ionicons name={item.icon} size={18} color={colors.primary} />
                    </View>
                    <Text style={styles.navLabel}>{item.label}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textMuted}
                    />
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>

          <Pressable
            style={[styles.logoutBtn, { marginBottom: Math.max(insets.bottom, 16) }]}
            onPress={onLogout}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutText}>Sign out</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    width: '82%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  brandText: {
    flex: 1,
    marginLeft: 12,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  brandSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: 18,
  },
  userMeta: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 2,
  },
  navItemPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  navIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    marginLeft: 8,
    color: colors.danger,
    fontWeight: '800',
    fontSize: 14,
  },
});

export default AppSidebar;
