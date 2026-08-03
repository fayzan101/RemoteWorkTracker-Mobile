import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ProfileChangePasswordScreen from '../screens/profile/ProfileChangePasswordScreen';
import DeviceInformationScreen from '../screens/profile/DeviceInformationScreen';

import ProjectListScreen from '../screens/projects/ProjectListScreen';
import ProjectDetailScreen from '../screens/projects/ProjectDetailScreen';
import ProjectTeamScreen from '../screens/projects/ProjectTeamScreen';
import ProjectProgressScreen from '../screens/projects/ProjectProgressScreen';

import SalarySummaryScreen from '../screens/payroll/SalarySummaryScreen';
import PayslipScreen from '../screens/payroll/PayslipScreen';
import OvertimeDetailsScreen from '../screens/payroll/OvertimeDetailsScreen';
import PayrollHistoryScreen from '../screens/payroll/PayrollHistoryScreen';

import MoodSubmissionScreen from '../screens/wellness/MoodSubmissionScreen';
import WellnessReportsScreen from '../screens/wellness/WellnessReportsScreen';
import BurnoutAlertsScreen from '../screens/wellness/BurnoutAlertsScreen';
import AIWellnessSuggestionsScreen from '../screens/wellness/AIWellnessSuggestionsScreen';

import RecommendedCoursesScreen from '../screens/learning/RecommendedCoursesScreen';
import EnrolledCoursesScreen from '../screens/learning/EnrolledCoursesScreen';
import CourseProgressScreen from '../screens/learning/CourseProgressScreen';

import MyViolationsScreen from '../screens/compliance/MyViolationsScreen';
import MyReviewsScreen from '../screens/performance/MyReviewsScreen';
import MyGoalsScreen from '../screens/goals/MyGoalsScreen';
import { stackScreenOptions } from './stackScreenOptions';

const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{
        title: 'Profile',
      }}
    />

    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        title: 'Edit Profile',
      }}
    />

    <Stack.Screen
      name="ProfileChangePassword"
      component={ProfileChangePasswordScreen}
      options={{
        title: 'Change Password',
      }}
    />

    <Stack.Screen
      name="DeviceInformation"
      component={DeviceInformationScreen}
      options={{
        title: 'Device Information',
      }}
    />

    <Stack.Screen
      name="ProjectList"
      component={ProjectListScreen}
      options={{
        title: 'Projects',
      }}
    />

    <Stack.Screen
      name="ProjectDetail"
      component={ProjectDetailScreen}
      options={{
        title: 'Project Details',
      }}
    />

    <Stack.Screen
      name="ProjectTeam"
      component={ProjectTeamScreen}
      options={{
        title: 'Project Team',
      }}
    />

    <Stack.Screen
      name="ProjectProgress"
      component={ProjectProgressScreen}
      options={{
        title: 'Project Progress',
      }}
    />

    <Stack.Screen
      name="SalarySummary"
      component={SalarySummaryScreen}
      options={{
        title: 'Payroll',
      }}
    />

    <Stack.Screen
      name="Payslip"
      component={PayslipScreen}
      options={{
        title: 'Payslip',
      }}
    />

    <Stack.Screen
      name="OvertimeDetails"
      component={OvertimeDetailsScreen}
      options={{
        title: 'Overtime Details',
      }}
    />

    <Stack.Screen
      name="PayrollHistory"
      component={PayrollHistoryScreen}
      options={{
        title: 'Payroll History',
      }}
    />

    <Stack.Screen
      name="MoodSubmission"
      component={MoodSubmissionScreen}
      options={{
        title: 'Mood Tracker',
      }}
    />

    <Stack.Screen
      name="WellnessReports"
      component={WellnessReportsScreen}
      options={{
        title: 'Wellness Reports',
      }}
    />

    <Stack.Screen
      name="BurnoutAlerts"
      component={BurnoutAlertsScreen}
      options={{
        title: 'Burnout Alerts',
      }}
    />

    <Stack.Screen
      name="AIWellnessSuggestions"
      component={AIWellnessSuggestionsScreen}
      options={{
        title: 'AI Wellness Tips',
      }}
    />

    <Stack.Screen
      name="RecommendedCourses"
      component={RecommendedCoursesScreen}
      options={{
        title: 'Recommended Courses',
      }}
    />

    <Stack.Screen
      name="EnrolledCourses"
      component={EnrolledCoursesScreen}
      options={{
        title: 'Enrolled Courses',
      }}
    />

    <Stack.Screen
      name="CourseProgress"
      component={CourseProgressScreen}
      options={{
        title: 'Course Progress',
      }}
    />

    <Stack.Screen
      name="MyGoals"
      component={MyGoalsScreen}
      options={{
        title: 'Goals',
      }}
    />

    <Stack.Screen
      name="MyViolations"
      component={MyViolationsScreen}
      options={{
        title: 'Compliance',
      }}
    />

    <Stack.Screen
      name="MyReviews"
      component={MyReviewsScreen}
      options={{
        title: 'Performance',
      }}
    />
  </Stack.Navigator>
);

export default ProfileStack;