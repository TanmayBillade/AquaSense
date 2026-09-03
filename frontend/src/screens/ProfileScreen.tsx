import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, TextInput, Button, Card, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useAppTheme } from '../theme';
import { formatDate } from '../utils/formatters';

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const theme = useAppTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'User');
  const [deviceName, setDeviceName] = useState(user?.device?.name || 'AquaSense Primary');
  const [deviceLocation, setDeviceLocation] = useState(user?.device?.location || 'Kitchen');
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
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of AquaSense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout && logout() 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.profileHeader}>
          <Avatar.Text 
            size={76} 
            label={getInitial(name)} 
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]} 
          />
          
          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                mode="outlined"
                value={name}
                onChangeText={setName}
                style={styles.nameInput}
                dense
                autoFocus
              />
              <IconButton 
                icon="check" 
                mode="contained"
                size={20} 
                onPress={handleSave} 
                loading={isSaving}
              />
              <IconButton 
                icon="close" 
                size={20} 
                onPress={() => { setName(user?.name || 'User'); setIsEditing(false); }} 
              />
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
                {name}
              </Text>
              <IconButton 
                icon="pencil" 
                size={18} 
                onPress={() => setIsEditing(true)} 
              />
            </View>
          )}

          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
            {user?.email || 'user@example.com'}
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
            Member since {formatDate(user?.createdAt || new Date().toISOString())}
          </Text>
        </View>

        {/* Device Info Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated" elevation={1}>
          <Card.Title 
            title="Connected Device" 
            titleVariant="titleMedium"
            titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }}
            left={(props) => <Avatar.Icon {...props} icon="router-wireless" size={40} style={{ backgroundColor: theme.colors.primaryContainer }} />}
          />
          <Card.Content>
            <Divider style={{ marginBottom: 12 }} />
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Device Name</Text>
              <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>{deviceName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Location</Text>
              <Text variant="bodyLarge" style={{ fontWeight: '600', color: theme.colors.onSurface }}>{deviceLocation}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Device ID</Text>
              <Text variant="bodyMedium" style={{ fontFamily: 'monospace', color: theme.colors.primary }}>
                {user?.device?.deviceId || 'ESP32-001'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Sampling Rate</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>Every 30 mins</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Account Info Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated" elevation={1}>
          <Card.Title 
            title="Account Information" 
            titleVariant="titleMedium"
            titleStyle={{ fontWeight: 'bold', color: theme.colors.onSurface }}
            left={(props) => <Avatar.Icon {...props} icon="shield-account" size={40} style={{ backgroundColor: theme.colors.secondaryContainer }} />}
          />
          <Card.Content>
            <Divider style={{ marginBottom: 12 }} />
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Email Address</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{user?.email || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Role</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, textTransform: 'capitalize' }}>
                {user?.role || 'User'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Prominent Logout Button */}
        <View style={styles.logoutContainer}>
          <Button 
            mode="contained" 
            icon="logout"
            onPress={handleLogout} 
            buttonColor={theme.colors.error}
            textColor="#FFFFFF"
            style={styles.logoutButton}
            contentStyle={{ paddingVertical: 6 }}
          >
            Log Out of AquaSense
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
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  avatar: {
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  nameInput: {
    flex: 1,
    maxWidth: 220,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButton: {
    borderRadius: 12,
  },
});

export default ProfileScreen;
