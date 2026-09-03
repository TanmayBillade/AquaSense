import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useReports, ReportType } from '../hooks/useReports';
import WeeklyReportCard from '../components/reports/WeeklyReportCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { useAppTheme } from '../theme';

const ReportsScreen = () => {
  const { reports, isLoading, error, refresh } = useReports();
  const theme = useAppTheme();

  const handleExportAll = async () => {
    if (!reports || reports.length === 0) return;
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { color: #0056b3; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>AquaSense Water Quality Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <tr>
              <th>Week</th>
              <th>Avg TDS</th>
              <th>Max TDS</th>
              <th>Min TDS</th>
              <th>Quality Score</th>
              <th>Trend</th>
            </tr>
            ${reports.map(r => `
              <tr>
                <td>${r.weekStart} to ${r.weekEnd}</td>
                <td>${Math.round(r.avgTDS)} ppm</td>
                <td>${Math.round(r.maxTDS)} ppm</td>
                <td>${Math.round(r.minTDS)} ppm</td>
                <td>${r.qualityScore}</td>
                <td>${r.trend}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }
    } catch (e) {
      console.error('Failed to export PDF', e);
    }
  };

  const renderContent = () => {
    if (isLoading && reports.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <SkeletonLoader width="100%" height={250} borderRadius={16} />
            </View>
          ))}
        </View>
      );
    }

    if (!isLoading && reports.length === 0) {
      return (
        <EmptyState
          icon="chart-line-variant"
          title="No Reports Yet"
          message="Weekly reports will appear here once enough data is collected."
        />
      );
    }

    return reports.slice(0, 4).map((report, index) => (
      <WeeklyReportCard
        key={index}
        report={report}
        onExport={() => handleExportAll()}
      />
    ));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>Weekly Reports</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Automated water quality analysis</Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} colors={[theme.colors.primary]} />}
      >
        {renderContent()}
      </ScrollView>

      {reports.length > 0 && (
        <FAB
          icon="export"
          label="Export All"
          style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
          color={theme.colors.onPrimaryContainer}
          onPress={handleExportAll}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    padding: 16,
  },
  skeletonCard: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});

export default ReportsScreen;
