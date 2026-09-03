import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { GaugeChart } from '../common/GaugeChart';
import { StatusBadge } from '../common/StatusBadge';

interface FilterHealthCardProps {
  healthPercent: number;
  estimatedDays: number;
  status: string;
  isLoading?: boolean;
}

export const FilterHealthCard: React.FC<FilterHealthCardProps> = ({
  healthPercent,
  estimatedDays,
  status,
  isLoading,
}) => {
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.center}>
          <SkeletonLoader width={140} height={80} borderRadius={8} />
          <View style={{ marginTop: 16 }}>
            <SkeletonLoader width={100} height={20} borderRadius={4} />
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.center}>
        <GaugeChart value={healthPercent} label="Filter Health" />
        <View style={styles.infoContainer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            Estimated remaining: {estimatedDays} days
          </Text>
          <StatusBadge status={status} size="small" />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
    elevation: 2,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
});
