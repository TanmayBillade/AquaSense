import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

// Main Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { ChartsScreen } from '../screens/ChartsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import ReportsScreen from '../screens/ReportsScreen';

// More Stack Screens
import MoreMenuScreen from '../screens/MoreMenuScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MoreStackParamList = {
  MoreMenu: undefined;
  Alerts: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Charts: undefined;
  History: undefined;
  Reports: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

const MoreNavigator = () => {
  const theme = useAppTheme();
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'fade',
      }}
    >
      <MoreStack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ headerShown: false }} />
      <MoreStack.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <MoreStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </MoreStack.Navigator>
  );
};

const MainNavigator = () => {
  const theme = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          if (route.name === 'Dashboard') iconName = 'view-dashboard';
          else if (route.name === 'Charts') iconName = 'chart-line';
          else if (route.name === 'History') iconName = 'history';
          else if (route.name === 'Reports') iconName = 'file-document-outline';
          else if (route.name === 'More') iconName = 'dots-horizontal';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Charts" component={ChartsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="More" component={MoreNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
