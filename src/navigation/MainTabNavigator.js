import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStack from './HomeStack';
import TasksStack from './TasksStack';
import AttendanceStack from './AttendanceStack';
import WellnessStack from './WellnessStack';
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
    name: 'WellnessTab',
    title: 'Wellness',
    component: WellnessStack,
    icon: 'leaf-outline',
    iconActive: 'leaf',
  },
  {
    name: 'ProfileTab',
    title: 'Profile',
    component: ProfileStack,
    icon: 'person-outline',
    iconActive: 'person',
  },
];

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomGap = Math.max(insets.bottom, 10);

  return (
    <View style={[styles.tabBarWrap, { bottom: bottomGap }]} pointerEvents="box-none">
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = TABS.find((t) => t.name === route.name) || TABS[index];
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              style={styles.tabButton}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || meta.title}
            >
              <View style={[styles.iconPill, focused && styles.iconPillActive]}>
                <Ionicons
                  name={focused ? meta.iconActive : meta.icon}
                  size={22}
                  color={focused ? colors.textOnPrimary : colors.tabInactive}
                />
              </View>
              <Text
                style={[styles.tabLabel, focused && styles.tabLabelActive]}
                numberOfLines={1}
              >
                {meta.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    {TABS.map((tab) => (
      <Tab.Screen
        key={tab.name}
        name={tab.name}
        component={tab.component}
        options={{ title: tab.title }}
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
  tabBarWrap: {
    position: 'absolute',
    left: 14,
    right: 14,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.16)',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 12,
    ...Platform.select({
      android: { overflow: 'visible' },
      ios: {},
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconPill: {
    width: 44,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  iconPillActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: colors.tabInactive,
    includeFontPadding: false,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});

export default MainTabNavigator;
