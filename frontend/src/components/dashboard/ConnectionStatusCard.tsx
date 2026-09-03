import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { getRelativeTime } from '../../utils/formatters';

interface ConnectionStatusCardProps {
  isConnected: boolean;
  lastSeen: string;
  isLoading?: boolean;
}

export const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({
  isConnected,
  lastSeen,
  isLoading,
}) => {
  const theme = useAppTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isConnected, pulseAnim]);

  if (isLoading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.row}>
          <SkeletonLoader width={20} height={20} borderRadius={10} />
          <View style={{ marginLeft: 12 }}>
            <SkeletonLoader width={100} height={20} borderRadius={4} />
          </View>
        </Card.Content>
      </Card>
    );
  }

  const dotColor = isConnected ? '#4caf50' : theme.colors.error;

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.row}>
        <Animated.View style={[styles.dot, { backgroundColor: dotColor, opacity: pulseAnim }]} />
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {isConnected ? 'Device Online' : 'Device Offline'}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Last seen: {getRelativeTime(lastSeen)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 16,
  },
});
