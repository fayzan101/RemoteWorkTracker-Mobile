import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeDashboardScreen from '../screens/dashboard/EmployeeDashboardScreen';
import ProductivityScoreScreen from '../screens/productivity/ProductivityScoreScreen';
import WeeklyPerformanceScreen from '../screens/productivity/WeeklyPerformanceScreen';
import AISuggestionsScreen from '../screens/productivity/AISuggestionsScreen';
import WorkloadAnalysisScreen from '../screens/productivity/WorkloadAnalysisScreen';
import NotificationCenterScreen from '../screens/notifications/NotificationCenterScreen';
import { stackScreenOptions } from './stackScreenOptions';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="EmployeeDashboard"
      component={EmployeeDashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <Stack.Screen
      name="NotificationCenter"
      component={NotificationCenterScreen}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen
      name="ProductivityScore"
      component={ProductivityScoreScreen}
      options={{ title: 'Productivity' }}
    />
    <Stack.Screen
      name="WeeklyPerformance"
      component={WeeklyPerformanceScreen}
      options={{ title: 'Weekly Analytics' }}
    />
    <Stack.Screen
      name="AISuggestions"
      component={AISuggestionsScreen}
      options={{ title: 'AI Insights' }}
    />
    <Stack.Screen
      name="WorkloadAnalysis"
      component={WorkloadAnalysisScreen}
      options={{ title: 'Workload Analysis' }}
    />
  </Stack.Navigator>
);

export default HomeStack;
