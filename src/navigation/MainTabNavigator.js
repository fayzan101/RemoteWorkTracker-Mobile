import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStack from './HomeStack';
import TasksStack from './TasksStack';
import AttendanceStack from './AttendanceStack';
import NotificationsStack from './NotificationsStack';
import ProfileStack from './ProfileStack';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon }) => (
  <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
    <Ionicons
      name={icon}
      size={22}
      color={focused ? colors.textOnPrimary : colors.tabInactive}
    />
  </View>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.label,
      tabBarActiveTintColor: colors.tabActive,
      tabBarInactiveTintColor: colors.tabInactive,
      tabBarHideOnKeyboard: true,
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{
        title: 'Home',
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} icon={focused ? 'home' : 'home-outline'} />
        ),
      }}
    />
    <Tab.Screen
      name="TasksTab"
      component={TasksStack}
      options={{
        title: 'Tasks',
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={focused ? 'checkmark-circle' : 'checkmark-circle-outline'}
          />
        ),
      }}
    />
    <Tab.Screen
      name="AttendanceTab"
      component={AttendanceStack}
      options={{
        title: 'Attendance',
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={focused ? 'calendar' : 'calendar-outline'}
          />
        ),
      }}
    />
    <Tab.Screen
      name="NotificationsTab"
      component={NotificationsStack}
      options={{
        title: 'Alerts',
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={focused ? 'notifications' : 'notifications-outline'}
          />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStack}
      options={{
        title: 'Profile',
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={focused ? 'person' : 'person-outline'}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 78,
    borderRadius: 28,
    backgroundColor: colors.tabBar,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconWrapper: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default MainTabNavigator;
