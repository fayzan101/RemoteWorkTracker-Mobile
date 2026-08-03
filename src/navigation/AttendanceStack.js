import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AttendanceHomeScreen from '../screens/attendance/AttendanceHomeScreen';
import DevicePairingScreen from '../screens/attendance/DevicePairingScreen';
import CheckInOutScreen from '../screens/attendance/CheckInOutScreen';
import AttendanceHistoryScreen from '../screens/attendance/AttendanceHistoryScreen';
import AttendanceCalendarScreen from '../screens/attendance/AttendanceCalendarScreen';
import WorkingHoursSummaryScreen from '../screens/attendance/WorkingHoursSummaryScreen';
import { stackScreenOptions } from './stackScreenOptions';

const Stack = createNativeStackNavigator();

const AttendanceStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="AttendanceHome" component={AttendanceHomeScreen} options={{ title: 'Attendance' }} />
    <Stack.Screen name="CheckInOut" component={CheckInOutScreen} options={{ title: 'Check In / Out' }} />
    <Stack.Screen name="DevicePairing" component={DevicePairingScreen} options={{ title: 'Device Pairing' }} />
    <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} options={{ title: 'Attendance History' }} />
    <Stack.Screen name="AttendanceCalendar" component={AttendanceCalendarScreen} options={{ title: 'Calendar View' }} />
    <Stack.Screen name="WorkingHoursSummary" component={WorkingHoursSummaryScreen} options={{ title: 'Working Hours' }} />
  </Stack.Navigator>
);

export default AttendanceStack;
