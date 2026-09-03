import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useReadings } from '../hooks/useReadings';
import { useFilterHealth } from '../hooks/useFilterHealth';
import { usePrediction } from '../hooks/usePrediction';
import { TDSCard } from '../components/dashboard/TDSCard';
import { QualityScoreCard } from '../components/dashboard/QualityScoreCard';
import { WaterQualityCard } from '../components/dashboard/WaterQualityCard';
import { FilterHealthCard } from '../components/dashboard/FilterHealthCard';
import { PredictionCard } from '../components/dashboard/PredictionCard';
import { ConnectionStatusCard } from '../components/dashboard/ConnectionStatusCard';

export const DashboardScreen = ({ navigation }: any) => {
  const theme = useAppTheme();
  
  const { 
    latestReading, 
    isLoading: isLoadingReadings, 
    error: readingsError,
    refresh: refreshReadings 
  } = useReadings();

  const { 
    filterHealth, 
    isLoading: isLoadingHealth, 
    refresh: refreshHealth 
  } = useFilterHealth();

  const { 
    prediction, 
    isLoading: isLoadingPrediction, 
    refresh: refreshPrediction 
  } = usePrediction();

  const onRefresh = useCallback(() => {
    refreshReadings();
    refreshHealth();
    refreshPrediction();
  }, [refreshReadings, refreshHealth, refreshPrediction]);

  const isLoading = isLoadingReadings || isLoadingHealth || isLoadingPrediction;

  if (readingsError) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{readingsError}</Text>
        <Button mode="contained" onPress={onRefresh}>Retry</Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.colors.primary} />
      }
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="water" size={32} color={theme.colors.primary} />
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            AquaSense
          </Text>
        </View>
        <IconButton
          icon="bell-outline"
          size={24}
          onPress={() => navigation.navigate('Alerts')}
        />
      </View>

      <View style={styles.content}>
        <TDSCard 
          tds={latestReading?.tds || 0} 
          timestamp={latestReading?.timestamp || new Date().toISOString()} 
          isLoading={isLoadingReadings} 
        />

        <View style={styles.row}>
          <QualityScoreCard 
            score={latestReading?.qualityScore || 0} 
            status={latestReading?.qualityStatus?.status || 'Unknown'} 
            isLoading={isLoadingReadings} 
          />
          <WaterQualityCard 
            status={latestReading?.qualityStatus?.status || 'Unknown'}
            description={latestReading?.qualityStatus?.description || 'Based on recent readings'}
            tds={latestReading?.tds || 0}
            isLoading={isLoadingReadings}
          />
        </View>

        <View style={styles.row}>
          <FilterHealthCard 
            healthPercent={filterHealth?.healthPercent || 0}
            estimatedDays={filterHealth?.estimatedDays || 0}
            status={filterHealth?.status || 'Unknown'}
            isLoading={isLoadingHealth}
          />
          <PredictionCard 
            tomorrow={prediction?.tomorrow || 0}
            nextWeek={prediction?.nextWeek || 0}
            trend={prediction?.trend || 'stable'}
            isLoading={isLoadingPrediction}
          />
        </View>

        <ConnectionStatusCard 
          isConnected={true} 
          lastSeen={new Date().toISOString()} 
          isLoading={isLoadingReadings}
        />
        
        <Text variant="bodySmall" style={[styles.lastUpdated, { color: theme.colors.onSurfaceVariant }]}>
          Pull to refresh
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastUpdated: {
    textAlign: 'center',
    marginVertical: 16,
  },
});
