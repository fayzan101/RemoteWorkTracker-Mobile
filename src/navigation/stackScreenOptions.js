import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { useSidebar } from './SidebarContext';

export function HeaderBackButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={styles.hit}
    >
      <Ionicons name="chevron-back" size={28} color={colors.appBarText} />
    </Pressable>
  );
}

export function HeaderMenuButton() {
  const { openSidebar } = useSidebar();
  return (
    <Pressable
      onPress={openSidebar}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      style={styles.hit}
    >
      <Ionicons name="menu" size={26} color={colors.appBarText} />
    </Pressable>
  );
}

/** Shared native-stack header — teal app bar, explicit back / optional menu. */
export const stackScreenOptions = ({ navigation, route }) => {
  const isRoot =
    route?.name === 'EmployeeDashboard' ||
    route?.name === 'MyTasks' ||
    route?.name === 'AttendanceHome' ||
    route?.name === 'NotificationCenter' ||
    route?.name === 'ProfileMain';

  return {
    headerStyle: {
      backgroundColor: colors.appBar,
    },
    headerShadowVisible: false,
    headerTintColor: colors.appBarText,
    headerTitleStyle: {
      fontWeight: '700',
      fontSize: 18,
      color: colors.appBarText,
    },
    headerTitleAlign: 'center',
    headerBackVisible: false,
    headerBackTitleVisible: false,
    contentStyle: {
      backgroundColor: colors.background,
    },
    animation: 'slide_from_right',
    headerLeft: () => {
      if (navigation.canGoBack()) {
        return <HeaderBackButton onPress={() => navigation.goBack()} />;
      }
      if (isRoot) {
        return <HeaderMenuButton />;
      }
      return null;
    },
  };
};

const styles = StyleSheet.create({
  hit: {
    marginLeft: Platform.OS === 'ios' ? 4 : 0,
    paddingHorizontal: 6,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
