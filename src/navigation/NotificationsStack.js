import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NotificationCenterScreen from '../screens/notifications/NotificationCenterScreen';

const Stack = createNativeStackNavigator();

const NotificationsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#020617',
      },

      headerShadowVisible: false,

      headerTintColor: '#FFFFFF',

      headerTitleStyle: {
        fontWeight: '800',
        fontSize: 20,
      },

      headerTitleAlign: 'center',

      contentStyle: {
        backgroundColor: '#020617',
      },

      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name="NotificationCenter"
      component={NotificationCenterScreen}
      options={{
        title: 'Notifications',
      }}
    />
  </Stack.Navigator>
);

export default NotificationsStack;