import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyTasksScreen from '../screens/tasks/MyTasksScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import UpdateTaskStatusScreen from '../screens/tasks/UpdateTaskStatusScreen';
import TaskCommentsScreen from '../screens/tasks/TaskCommentsScreen';
import TaskAttachmentsScreen from '../screens/tasks/TaskAttachmentsScreen';

const Stack = createNativeStackNavigator();

const TasksStack = () => (
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
      name="MyTasks"
      component={MyTasksScreen}
      options={{
        title: 'My Tasks',
      }}
    />

    <Stack.Screen
      name="TaskDetail"
      component={TaskDetailScreen}
      options={{
        title: 'Task Details',
      }}
    />

    <Stack.Screen
      name="UpdateTaskStatus"
      component={UpdateTaskStatusScreen}
      options={{
        title: 'Update Status',
      }}
    />

    <Stack.Screen
      name="TaskComments"
      component={TaskCommentsScreen}
      options={{
        title: 'Comments',
      }}
    />

    <Stack.Screen
      name="TaskAttachments"
      component={TaskAttachmentsScreen}
      options={{
        title: 'Attachments',
      }}
    />
  </Stack.Navigator>
);

export default TasksStack;