import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Button, SegmentedButtons, TextInput, Snackbar, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../contexts/SettingsContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAppTheme } from '../theme';

const SettingsScreen = () => {
  const theme = useAppTheme();
  const { settings, updateSettings } = useSettings();
  const { themeMode, setThemeMode } = useThemeMode();

  const [localSettings, setLocalSettings] = useState(settings || {
    safeTdsThreshold: 300,
    units: 'ppm',
    notifications: {
      tdsAlert: true,
      filterAlert: true,
      connectionAlert: true,
    },
    samplingInterval: '60s'
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      setSnackbarVisible(true);
    } catch (e) {
      console.error(e);
    }
  };

  const updateNestedSetting = (category: string, key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <List.Section title="Water Quality">
          <List.Item
            title="Safe TDS Threshold"
            description="Maximum acceptable TDS level"
            left={props => <List.Icon {...props} icon="water-alert" />}
            right={() => (
              <TextInput
                mode="outlined"
                value={String(localSettings.safeTdsThreshold)}
                onChangeText={text => setLocalSettings(prev => ({ ...prev, safeTdsThreshold: Number(text) || 0 }))}
                keyboardType="numeric"
                style={styles.numberInput}
                dense
              />
            )}
          />
          <List.Item
            title="Measurement Units"
            description="Display units for reports"
            left={props => <List.Icon {...props} icon="scale" />}
          />
          <View style={styles.segmentedContainer}>
            <SegmentedButtons
              value={localSettings.units}
              onValueChange={val => setLocalSettings(prev => ({ ...prev, units: val }))}
              buttons={[
                { value: 'ppm', label: 'ppm' },
                { value: 'mg/L', label: 'mg/L' },
              ]}
            />
          </View>
        </List.Section>

        <Divider />

        <List.Section title="Notifications">
          <List.Item
            title="TDS Alerts"
            description="Notify when TDS exceeds threshold"
            left={props => <List.Icon {...props} icon="bell-alert" />}
            right={() => <Switch value={localSettings.notifications.tdsAlert} onValueChange={v => updateNestedSetting('notifications', 'tdsAlert', v)} />}
          />
          <List.Item
            title="Filter Warnings"
            description="Notify when filter needs replacement"
            left={props => <List.Icon {...props} icon="filter-remove" />}
            right={() => <Switch value={localSettings.notifications.filterAlert} onValueChange={v => updateNestedSetting('notifications', 'filterAlert', v)} />}
          />
          <List.Item
            title="Connection Alerts"
            description="Notify when sensor is offline"
            left={props => <List.Icon {...props} icon="wifi-off" />}
            right={() => <Switch value={localSettings.notifications.connectionAlert} onValueChange={v => updateNestedSetting('notifications', 'connectionAlert', v)} />}
          />
        </List.Section>

        <Divider />

        <List.Section title="Monitoring">
          <List.Item
            title="Sampling Interval"
            description="How often data is collected"
            left={props => <List.Icon {...props} icon="clock-outline" />}
          />
          <View style={styles.segmentedContainer}>
             <SegmentedButtons
              value={localSettings.samplingInterval}
              onValueChange={val => setLocalSettings(prev => ({ ...prev, samplingInterval: val }))}
              buttons={[
                { value: '15s', label: '15s' },
                { value: '60s', label: '1m' },
                { value: '5min', label: '5m' },
              ]}
            />
          </View>
        </List.Section>

        <Divider />

        <List.Section title="Appearance">
          <List.Item
            title="Theme"
            description="Choose app appearance"
            left={props => <List.Icon {...props} icon="palette" />}
          />
          <View style={styles.segmentedContainer}>
            <SegmentedButtons
              value={themeMode}
              onValueChange={val => setThemeMode(val as 'light'|'dark'|'system')}
              buttons={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
          </View>
        </List.Section>

        <Divider />

        <List.Section title="About">
          <List.Item
            title="App Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
          <List.Item
            title="Build"
            description="Research Paper Edition"
            left={props => <List.Icon {...props} icon="cellphone-cog" />}
          />
        </List.Section>
        
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Save Settings
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}>
        Settings saved successfully
      </Snackbar>
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
    paddingBottom: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  numberInput: {
    width: 80,
    textAlign: 'center',
  },
  segmentedContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
  saveButton: {
    paddingVertical: 6,
    borderRadius: 8,
  }
});

export default SettingsScreen;
