import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStack from './HomeStack';
import TasksStack from './TasksStack';
import AttendanceStack from './AttendanceStack';
import NotificationsStack from './NotificationsStack';
import ProfileStack from './ProfileStack';
import { SidebarProvider } from './SidebarContext';
import AppSidebar from './AppSidebar';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const TABS = [
  {
    name: 'HomeTab',
    title: 'Home',
    component: HomeStack,
    icon: 'home-outline',
    iconActive: 'home',
  },
  {
    name: 'TasksTab',
    title: 'Tasks',
    component: TasksStack,
    icon: 'checkmark-circle-outline',
    iconActive: 'checkmark-circle',
  },
  {
    name: 'AttendanceTab',
    title: 'Attend',
    component: AttendanceStack,
    icon: 'calendar-outline',
    iconActive: 'calendar',
  },
  {
    name: 'NotificationsTab',
    title: 'Alerts',
    component: NotificationsStack,
    icon: 'notifications-outline',
    iconActive: 'notifications',
  },
  {
    name: 'ProfileTab',
    title: 'Profile',
    component: ProfileStack,
    icon: 'person-outline',
    iconActive: 'person',
  },
];

function TabBarButton({ accessibilityState, onPress, onLongPress, label, icon, iconActive }) {
  const focused = accessibilityState?.selected;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
    >
      <View style={[styles.iconPill, focused && styles.iconPillActive]}>
        <Ionicons
          name={focused ? iconActive : icon}
          size={20}
          color={focused ? colors.textOnPrimary : colors.tabInactive}
        />
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
      tabBarHideOnKeyboard: true,
    }}
  >
    {TABS.map((tab) => (
      <Tab.Screen
        key={tab.name}
        name={tab.name}
        component={tab.component}
        options={{
          title: tab.title,
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              label={tab.title}
              icon={tab.icon}
              iconActive={tab.iconActive}
            />
          ),
        }}
      />
    ))}
  </Tab.Navigator>
);

const MainTabNavigator = () => (
  <SidebarProvider>
    <MainTabs />
    <AppSidebar />
  </SidebarProvider>
);

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 22 : 14,
    height: 72,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.14)',
    paddingHorizontal: 4,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
  },
  iconPill: {
    width: 42,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  iconPillActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.tabInactive,
    letterSpacing: 0.15,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});

export default MainTabNavigator;
