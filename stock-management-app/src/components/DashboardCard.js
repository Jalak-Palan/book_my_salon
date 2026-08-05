import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const DashboardCard = ({ title, value, icon, color, trend, trendType, style }) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    if (trendType === 'up') return 'arrow-up';
    if (trendType === 'down') return 'arrow-down';
    return 'minus';
  };

  const getTrendColor = () => {
    if (trendType === 'up') return theme.colors.success;
    if (trendType === 'down') return theme.colors.error;
    if (trendType === 'warning') return theme.colors.warning;
    return theme.colors.onSurfaceVariant;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.dark ? 0.3 : 0.05,
          shadowRadius: 6,
          elevation: 2,
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <MaterialCommunityIcons name={icon} size={22} color={color} />
        </View>
        {trend && (
          <View style={[styles.trendContainer, { backgroundColor: getTrendColor() + '10' }]}>
            <MaterialCommunityIcons name={getTrendIcon()} size={12} color={getTrendColor()} />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>{trend}</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    flex: 1,
    minWidth: '45%',
    margin: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  body: {
    marginTop: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
