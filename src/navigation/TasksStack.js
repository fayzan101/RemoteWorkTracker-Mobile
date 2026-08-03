import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTasksScreen from '../screens/tasks/MyTasksScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import UpdateTaskStatusScreen from '../screens/tasks/UpdateTaskStatusScreen';
import TaskCommentsScreen from '../screens/tasks/TaskCommentsScreen';
import TaskAttachmentsScreen from '../screens/tasks/TaskAttachmentsScreen';
import { stackScreenOptions } from './stackScreenOptions';

const Stack = createNativeStackNavigator();

const TasksStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="MyTasks" component={MyTasksScreen} options={{ title: 'My Tasks' }} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Details' }} />
    <Stack.Screen name="UpdateTaskStatus" component={UpdateTaskStatusScreen} options={{ title: 'Update Status' }} />
    <Stack.Screen name="TaskComments" component={TaskCommentsScreen} options={{ title: 'Comments' }} />
    <Stack.Screen name="TaskAttachments" component={TaskAttachmentsScreen} options={{ title: 'Attachments' }} />
  </Stack.Navigator>
);

export default TasksStack;
