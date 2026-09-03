import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeMode } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';
import { lightTheme, darkTheme } from './src/theme';

const MainApp = () => {
  const { isDarkMode } = useThemeMode();
  const activeTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={activeTheme}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <MainApp />
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
