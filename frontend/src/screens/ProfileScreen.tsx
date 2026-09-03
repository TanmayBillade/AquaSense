import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, TextInput, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useAppTheme } from '../theme';
import { formatDate } from '../utils/formatters';

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const theme = useAppTheme();

  const [name, setName] = useState(user?.name || 'User');
  const [deviceName, setDeviceName] = useState('AquaSense Primary');
  const [deviceLocation, setDeviceLocation] = useState('Kitchen Sink');
  const [isSaving, setIsSaving] = useState(false);

  const getInitial = (nameStr: string) => {
    return nameStr ? nameStr.charAt(0).toUpperCase() : 'U';
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({ name });
      }
      // Simulating API delay
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout && logout(), style: "destructive" }
      ]
    );
  };

  const hasChanges = name !== user?.name;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.profileHeader}>
          <Avatar.Text 
            size={80} 
            label={getInitial(name)} 
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]} 
          />
          <TextInput
            mode="flat"
            value={name}
            onChangeText={setName}
            style={styles.nameInput}
            activeUnderlineColor={theme.colors.primary}
            theme={{ colors: { background: 'transparent' } }}
          />
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {user?.email || 'user@example.com'}
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
            Member since {formatDate(user?.createdAt || new Date().toISOString())}
          </Text>
        </View>

        <Card style={styles.card} mode="outlined">
          <Card.Title title="Device Information" titleStyle={{ color: theme.colors.primary }} />
          <Card.Content>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>Device Name</Text>
              <TextInput
                mode="outlined"
                value={deviceName}
                onChangeText={setDeviceName}
                dense
              />
            </View>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>Location</Text>
              <TextInput
                mode="outlined"
                value={deviceLocation}
                onChangeText={setDeviceLocation}
                dense
              />
            </View>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>Device ID</Text>
              <TextInput
                mode="outlined"
                value="AQS-2026-8921"
                disabled
                dense
              />
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionsContainer}>
          <Button 
            mode="contained" 
            onPress={handleSave} 
            disabled={!hasChanges || isSaving}
            loading={isSaving}
            style={styles.actionButton}
          >
            Save Changes
          </Button>
          <Button 
            mode="outlined" 
            onPress={handleLogout} 
            textColor={theme.colors.error}
            style={[styles.actionButton, styles.logoutButton, { borderColor: theme.colors.error }]}
          >
            Logout
          </Button>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatar: {
    marginBottom: 16,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 48,
    marginBottom: 4,
    minWidth: 200,
  },
  card: {
    marginBottom: 24,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutButton: {
    borderWidth: 1,
  }
});

export default ProfileScreen;
