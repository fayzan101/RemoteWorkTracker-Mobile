import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationCenterScreen from '../screens/notifications/NotificationCenterScreen';
import { stackScreenOptions } from './stackScreenOptions';

const Stack = createNativeStackNavigator();

const NotificationsStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="NotificationCenter"
      component={NotificationCenterScreen}
      options={{ title: 'Notifications' }}
    />
  </Stack.Navigator>
);

export default NotificationsStack;
