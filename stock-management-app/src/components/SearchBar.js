import React from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const SearchBar = ({ placeholder = 'Search...', value, onChangeText, onFilterPress, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.roundness }, style]}>
      <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: theme.colors.onSurface }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant + '70'}
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} style={styles.actionButton}>
          <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.onSurfaceVariant} />
        </Pressable>
      ) : null}
      {onFilterPress && (
        <Pressable onPress={onFilterPress} style={[styles.actionButton, styles.filterBorder, { borderColor: theme.colors.outline }]}>
          <MaterialCommunityIcons name="filter-variant" size={20} color={theme.colors.primary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    paddingVertical: 0,
  },
  actionButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBorder: {
    borderLeftWidth: 1,
    marginLeft: 6,
    paddingLeft: 10,
  },
});
