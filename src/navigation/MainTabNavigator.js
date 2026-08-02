import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStack from './HomeStack';
import TasksStack from './TasksStack';
import AttendanceStack from './AttendanceStack';
import NotificationsStack from './NotificationsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon }) => {
  return (
    <View
      style={[
        styles.iconWrapper,
        focused && styles.activeIconWrapper,
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={focused ? '#fff' : '#94A3B8'}
      />
    </View>
  );
};

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,

      tabBarShowLabel: true,

      tabBarStyle: styles.tabBar,

      tabBarLabelStyle: styles.label,

      tabBarActiveTintColor: '#FFFFFF',

      tabBarInactiveTintColor: '#94A3B8',

      tabBarHideOnKeyboard: true,
    }}
  >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={focused ? 'home' : 'home-outline'}
            />
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

    borderRadius: 30,

    backgroundColor: 'rgba(15,23,42,0.92)',

    borderTopWidth: 0,

    paddingTop: 10,
    paddingBottom: 10,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.3,
    shadowRadius: 20,

    elevation: 15,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',

    marginBottom: 4,
  },

  iconWrapper: {
    width: 46,
    height: 46,

    borderRadius: 23,

    justifyContent: 'center',
    alignItems: 'center',
  },

  activeIconWrapper: {
    backgroundColor: '#3B82F6',

    shadowColor: '#3B82F6',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 8,
  },
});

export default MainTabNavigator;