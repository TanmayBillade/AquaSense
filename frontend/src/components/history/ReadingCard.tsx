import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

interface ReadingCardProps {
  reading: {
    _id: string;
    tds: number;
    timestamp: string;
    qualityScore: number;
    status: string;
  };
  onPress?: () => void;
}

export const ReadingCard: React.FC<ReadingCardProps> = ({ reading, onPress }) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.content}>
          <View style={styles.leftCol}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
              {reading.tds} ppm
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              {formatDateTime(reading.timestamp)}
            </Text>
          </View>
          
          <View style={styles.rightCol}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary, marginBottom: 4 }}>
              Score: {reading.qualityScore?.toFixed(0) || 'N/A'}
            </Text>
            <StatusBadge status={reading.status} size="small" />
          </View>
        </Card.Content>
      </Card>
      <Divider />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 4,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
});
