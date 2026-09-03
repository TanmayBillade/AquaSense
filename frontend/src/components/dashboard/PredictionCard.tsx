import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { SkeletonLoader } from '../common/SkeletonLoader';

interface PredictionCardProps {
  tomorrow: number;
  nextWeek: number;
  trend: 'improving' | 'stable' | 'degrading';
  isLoading?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  tomorrow,
  nextWeek,
  trend,
  isLoading,
}) => {
  const theme = useAppTheme();

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return 'trending-down'; // lower TDS is better
      case 'degrading': return 'trending-up';
      case 'stable': return 'trending-neutral';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving': return '#4caf50';
      case 'degrading': return theme.colors.error;
      case 'stable': return theme.colors.primary;
    }
  };

  if (isLoading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <SkeletonLoader width={100} height={20} borderRadius={4} />
          <View style={{ marginTop: 12 }}>
            <SkeletonLoader width={140} height={20} borderRadius={4} />
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
          Predictions
        </Text>
        
        <View style={styles.row}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Tomorrow:</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>{tomorrow} ppm</Text>
        </View>
        
        <View style={styles.row}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Next Week:</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>{nextWeek} ppm</Text>
        </View>

        <View style={[styles.trendContainer, { marginTop: 16 }]}>
          <MaterialCommunityIcons name={getTrendIcon()} size={24} color={getTrendColor()} />
          <Text variant="bodyMedium" style={{ color: getTrendColor(), marginLeft: 8, textTransform: 'capitalize' }}>
            {trend}
          </Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
