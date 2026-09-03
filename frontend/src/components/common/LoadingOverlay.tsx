import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';

interface Props {
  message?: string;
}

const LoadingOverlay: React.FC<Props> = ({ message }) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface + 'CC' }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && <Text style={[styles.message, { color: theme.colors.onSurface }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  message: { marginTop: 16, fontSize: 16, fontWeight: '500' },
});

export default LoadingOverlay;
