import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MIN_TOUCH_SIZE } from '../utils/dimensions';

export const SearchBar = ({ placeholder = 'Search...', value, onChangeText, onFilterPress, style }) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.outline + '00', theme.colors.primary + 'AA'],
  });

  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surfaceVariant, theme.colors.primaryContainer + '55'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderRadius: theme.roundness,
          borderWidth: 1.5,
          borderColor: borderColor,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, { color: theme.colors.onSurface }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant + '80'}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
      />
      {value ? (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.actionButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.onSurfaceVariant} />
        </Pressable>
      ) : null}
      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          style={[styles.actionButton, styles.filterBorder, { borderColor: theme.colors.outline + '80' }]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <MaterialCommunityIcons name="filter-variant" size={22} color={theme.colors.primary} />
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    paddingVertical: 0,
    fontWeight: '400',
  },
  actionButton: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBorder: {
    borderLeftWidth: 1,
    marginLeft: 4,
    paddingLeft: 6,
  },
});
