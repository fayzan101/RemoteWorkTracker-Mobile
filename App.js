/**
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/utils/splash';

function App() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    NavigationBar.setVisibilityAsync('visible');
    NavigationBar.setButtonStyleAsync('light');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
