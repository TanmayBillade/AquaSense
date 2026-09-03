import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { getHistory } from '../services/readingsService';
import { ReadingCard } from '../components/history/ReadingCard';
import { SearchBar } from '../components/history/SearchBar';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const HistoryScreen = () => {
  const theme = useAppTheme();
  
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [dateSearch, setDateSearch] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const limit = 20;
      const currentPage = isRefresh ? 1 : page;
      
      const response = await getHistory({
        page: currentPage,
        limit,
        sortBy: sortField,
        sortOrder,
        date: dateSearch || undefined
      });

      const items = response?.readings || [];
      if (isRefresh) {
        setData(items);
      } else {
        setData(prev => [...prev, ...items]);
      }
      
      setTotalCount(response?.totalCount || 0);
      setHasMore(items.length === limit);
      if (isRefresh) setPage(2);
      else setPage(prev => prev + 1);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, sortField, sortOrder, dateSearch]);

  useEffect(() => {
    fetchHistory(true);
  }, [sortField, sortOrder, dateSearch]);

  const handleLoadMore = () => {
    if (!isLoading && !isRefreshing && hasMore) {
      fetchHistory(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ padding: 16 }}>
        <SkeletonLoader width={300} height={80} borderRadius={8} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading || isRefreshing) return null;
    return (
      <EmptyState 
        icon="history" 
        title="No Readings Found" 
        message="No water quality readings match your search criteria." 
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onBackground }}>
          History
        </Text>
        <Badge style={{ backgroundColor: theme.colors.primary, marginLeft: 8 }} size={24}>
          {totalCount}
        </Badge>
      </View>

      <SearchBar
        onDateSearch={setDateSearch}
        onSort={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      <FlatList
        data={data}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => <ReadingCard reading={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => fetchHistory(true)} tintColor={theme.colors.primary} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
});
