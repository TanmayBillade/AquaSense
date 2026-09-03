import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Icon } from 'react-native-paper';
import { AlertType } from '../../hooks/useAlerts';
import { getRelativeTime } from '../../utils/formatters';
import { useAppTheme } from '../../theme';
import { Colors } from '../../theme/colors';

interface AlertCardProps {
  alert: AlertType;
  onMarkRead?: (id: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onMarkRead }) => {
  const theme = useAppTheme();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'tds_high': return 'alert-circle';
      case 'rapid_increase': return 'trending-up';
      case 'filter_warning': return 'filter-remove';
      case 'connection_lost': return 'wifi-off';
      default: return 'bell';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'tds_high': return Colors.status.poor;
      case 'rapid_increase': return Colors.status.moderate;
      case 'filter_warning': return Colors.status.unsafe;
      case 'connection_lost': return theme.colors.outline;
      default: return theme.colors.primary;
    }
  };

  return (
    <Card 
      style={[
        styles.card, 
        { backgroundColor: theme.colors.surface },
        !alert.read && { borderLeftWidth: 4, borderLeftColor: getAlertColor(alert.type) }
      ]}
      elevation={alert.read ? 0 : 1}
      mode={alert.read ? 'outlined' : 'elevated'}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon source={getAlertIcon(alert.type)} size={28} color={getAlertColor(alert.type)} />
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={[{ color: theme.colors.onSurface }, !alert.read && { fontWeight: 'bold' }]}>
              {typeof alert?.type === 'string' ? alert.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Alert'}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {getRelativeTime(alert.createdAt)}
            </Text>
          </View>
          
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {alert.message}
          </Text>

          {alert.tdsValue && alert.threshold && (
            <View style={styles.valueRow}>
              <Text variant="labelMedium" style={{ color: theme.colors.error }}>
                Value: {alert.tdsValue} ppm
              </Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 12 }}>
                Threshold: {alert.threshold} ppm
              </Text>
            </View>
          )}
        </View>

        {!alert.read && (
          <View style={styles.actionsContainer}>
            <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
            {onMarkRead && (
              <IconButton
                icon="check"
                size={20}
                iconColor={theme.colors.primary}
                onPress={() => onMarkRead(alert._id)}
                style={styles.checkButton}
              />
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  valueRow: {
    flexDirection: 'row',
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 6,
  },
  actionsContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  checkButton: {
    margin: 0,
    marginTop: 8,
  }
});

export default AlertCard;
