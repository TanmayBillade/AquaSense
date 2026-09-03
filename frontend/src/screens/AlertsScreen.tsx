import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Chip, Button, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlerts, AlertType } from '../hooks/useAlerts';
import AlertCard from '../components/alerts/AlertCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { useAppTheme } from '../theme';

const FILTERS = ['All', 'Unread', 'TDS High', 'Filter Warning', 'Connection'];

const AlertsScreen = () => {
  const { alerts, isLoading, unreadCount, refresh, markRead } = useAlerts();
  const [activeFilter, setActiveFilter] = useState('All');
  const theme = useAppTheme();

  const handleMarkAllRead = () => {
    alerts.forEach(alert => {
      if (!alert.read) {
        markRead(alert._id);
      }
    });
  };

  const getFilteredAlerts = () => {
    switch (activeFilter) {
      case 'Unread':
        return alerts.filter(a => !a.read);
      case 'TDS High':
        return alerts.filter(a => a.type === 'tds_high');
      case 'Filter Warning':
        return alerts.filter(a => a.type === 'filter_warning');
      case 'Connection':
        return alerts.filter(a => a.type === 'connection_lost');
      default:
        return alerts;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.titleRow}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>Alerts</Text>
          {unreadCount > 0 && (
            <Badge size={24} style={[styles.badge, { backgroundColor: theme.colors.error }]}>
              {unreadCount}
            </Badge>
          )}
        </View>
        {unreadCount > 0 && (
          <Button mode="text" onPress={handleMarkAllRead} compact>
            Mark All Read
          </Button>
        )}
      </View>
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={activeFilter === item}
              onPress={() => setActiveFilter(item)}
              style={styles.chip}
              showSelectedOverlay
            >
              {item}
            </Chip>
          )}
        />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <SkeletonLoader width="100%" height={120} borderRadius={12} />
            </View>
          ))}
        </View>
      );
    }
    return (
      <EmptyState
        icon="shield-check"
        title="No alerts"
        message="Your water quality is being monitored. Everything looks good!"
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      {renderHeader()}
      <FlatList
        data={getFilteredAlerts()}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AlertCard alert={item} onMarkRead={markRead} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} colors={[theme.colors.primary]} />}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: 8,
  },
  filtersContainer: {
    paddingLeft: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  loadingContainer: {
    padding: 16,
  },
  skeletonCard: {
    marginBottom: 12,
  },
});

export default AlertsScreen;
