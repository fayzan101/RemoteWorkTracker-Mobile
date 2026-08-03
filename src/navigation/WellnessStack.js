import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoodSubmissionScreen from '../screens/wellness/MoodSubmissionScreen';
import WellnessReportsScreen from '../screens/wellness/WellnessReportsScreen';
import BurnoutAlertsScreen from '../screens/wellness/BurnoutAlertsScreen';
import AIWellnessSuggestionsScreen from '../screens/wellness/AIWellnessSuggestionsScreen';
import { stackScreenOptions } from './stackScreenOptions';

const Stack = createNativeStackNavigator();

const WellnessStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="WellnessHome"
      component={MoodSubmissionScreen}
      options={{ title: 'Wellness' }}
    />
    <Stack.Screen
      name="WellnessReports"
      component={WellnessReportsScreen}
      options={{ title: 'Wellness Reports' }}
    />
    <Stack.Screen
      name="BurnoutAlerts"
      component={BurnoutAlertsScreen}
      options={{ title: 'Burnout Alerts' }}
    />
    <Stack.Screen
      name="AIWellnessSuggestions"
      component={AIWellnessSuggestionsScreen}
      options={{ title: 'AI Wellness Tips' }}
    />
  </Stack.Navigator>
);

export default WellnessStack;
