import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import ErrorBoundary from './src/components/ErrorBoundary';
import OfflineNotice from './src/components/OfflineNotice';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <OfflineNotice />
      <AppNavigator />
    </ErrorBoundary>
  );
}
