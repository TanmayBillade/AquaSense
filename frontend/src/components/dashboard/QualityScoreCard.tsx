import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { CircularProgress } from '../common/CircularProgress';
import { StatusBadge } from '../common/StatusBadge';
import { Colors } from '../../theme/colors';

interface QualityScoreCardProps {
  score: number;
  status: string;
  isLoading?: boolean;
}

export const QualityScoreCard: React.FC<QualityScoreCardProps> = ({ score, status, isLoading }) => {
  const theme = useAppTheme();

  const getScoreColor = (st: string) => {
    const statusStr = typeof st === 'string' ? st.toLowerCase() : '';
    switch (statusStr) {
      case 'excellent': return Colors.status.excellent;
      case 'good': return Colors.status.good;
      case 'moderate': return Colors.status.moderate;
      case 'poor': return Colors.status.poor;
      case 'unsafe': return Colors.status.unsafe;
      default: return theme.colors.primary;
    }
  };

  if (isLoading) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.center}>
          <SkeletonLoader width={100} height={100} borderRadius={50} />
          <View style={{ marginTop: 16 }}>
            <SkeletonLoader width={80} height={24} borderRadius={12} />
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.center}>
        <CircularProgress
          value={score}
          color={getScoreColor(status)}
          label="Quality Score"
        />
        <View style={styles.badgeContainer}>
          <StatusBadge status={status} size="medium" />
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
  badgeContainer: {
    marginTop: 16,
  },
});
