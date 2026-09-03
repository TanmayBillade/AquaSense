import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Avatar, Divider, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../hooks/useAlerts';
import { useAppTheme } from '../theme';

const MoreMenuScreen = () => {
  const { user } = useAuth();
  const { unreadCount } = useAlerts();
  const theme = useAppTheme();
  const navigation = useNavigation<any>();

  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
          Hello, {user?.name?.split(' ')[0] || 'User'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.userCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Avatar.Text size={56} label={getInitial(user?.name || '')} style={{ backgroundColor: theme.colors.primary }} />
          <View style={styles.userInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}>
              {user?.name || 'User'}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>

        <View style={[styles.menuContainer, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Alerts"
            description="Notifications and warnings"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
              <View style={styles.rightAction}>
                {unreadCount > 0 && <Badge size={20} style={styles.badge}>{unreadCount}</Badge>}
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={() => navigation.navigate('Alerts')}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Settings"
            description="App and device configuration"
            left={props => <List.Icon {...props} icon="cog" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings')}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="Profile"
            description="Account and device details"
            left={props => <List.Icon {...props} icon="account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Profile')}
            style={styles.menuItem}
          />
          <Divider />
          <List.Item
            title="About"
            description="App info and support"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            style={styles.menuItem}
          />
        </View>

        <View style={styles.footer}>
          <Text variant="labelMedium" style={{ color: theme.colors.outline }}>
            AquaSense v1.0.0
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
            Research Paper Edition
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  menuContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 8,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: 0,
    alignSelf: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
});

export default MoreMenuScreen;
