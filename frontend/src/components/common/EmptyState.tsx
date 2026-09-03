import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';

interface Props {
  icon: string;
  title?: string;
  message: string;
}

const EmptyState: React.FC<Props> = ({ icon, title, message }) => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={64} color={theme.colors.outlineVariant} />
      {title && (
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      )}
      <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { marginTop: 16, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  message: { marginTop: 8, fontSize: 16, textAlign: 'center' },
});

export { EmptyState };
export default EmptyState;
