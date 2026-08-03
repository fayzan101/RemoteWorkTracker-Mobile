import React from 'react';
import { Pressable, StyleSheet, Platform, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { useSidebar } from './SidebarContext';
import { navigationRef } from './navigationRef';

export function HeaderBackButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={styles.hitLeft}
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
      style={styles.hitLeft}
    >
      <Ionicons name="menu" size={26} color={colors.appBarText} />
    </Pressable>
  );
}

export function HeaderNotificationButton() {
  return (
    <Pressable
      onPress={() => {
        if (navigationRef.isReady()) {
          navigationRef.navigate('Main', {
            screen: 'HomeTab',
            params: { screen: 'NotificationCenter' },
          });
        }
      }}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Notifications"
      style={styles.hitRight}
    >
      <View style={styles.bellWrap}>
        <Ionicons name="notifications-outline" size={22} color={colors.appBarText} />
      </View>
    </Pressable>
  );
}

/** Shared native-stack header — teal app bar, back / menu, notification bell. */
export const stackScreenOptions = ({ navigation, route }) => {
  const isRoot =
    route?.name === 'EmployeeDashboard' ||
    route?.name === 'MyTasks' ||
    route?.name === 'AttendanceHome' ||
    route?.name === 'WellnessHome' ||
    route?.name === 'ProfileMain';

  const hideBell = route?.name === 'NotificationCenter';

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
    headerRight: () => (hideBell ? null : <HeaderNotificationButton />),
  };
};

const styles = StyleSheet.create({
  hitLeft: {
    marginLeft: Platform.OS === 'ios' ? 4 : 0,
    paddingHorizontal: 6,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitRight: {
    marginRight: Platform.OS === 'ios' ? 4 : 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
});
