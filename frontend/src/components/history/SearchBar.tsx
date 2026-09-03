import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Chip, IconButton } from 'react-native-paper';
import { useAppTheme } from '../../theme';

interface SearchBarProps {
  onDateSearch: (date: string) => void;
  onSort: (field: string, order: string) => void;
  sortField: string;
  sortOrder: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onDateSearch,
  onSort,
  sortField,
  sortOrder,
}) => {
  const theme = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onDateSearch(query);
  };

  const handleSortToggle = (field: string) => {
    if (sortField === field) {
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'desc');
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by date (YYYY-MM-DD)"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={theme.colors.primary}
      />
      <View style={styles.chipsContainer}>
        <Chip
          selected={sortField === 'timestamp'}
          onPress={() => handleSortToggle('timestamp')}
          style={styles.chip}
          mode="outlined"
        >
          Date
        </Chip>
        <Chip
          selected={sortField === 'tds'}
          onPress={() => handleSortToggle('tds')}
          style={styles.chip}
          mode="outlined"
        >
          TDS
        </Chip>
        <Chip
          selected={sortField === 'qualityScore'}
          onPress={() => handleSortToggle('qualityScore')}
          style={styles.chip}
          mode="outlined"
        >
          Score
        </Chip>
        <IconButton
          icon={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
          size={20}
          onPress={() => onSort(sortField, sortOrder === 'asc' ? 'desc' : 'asc')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchbar: {
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
});
