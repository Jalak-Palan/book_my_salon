import React, { useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dimensions } from 'react-native';
import { normalize, isSmallDevice } from '../utils/dimensions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 2 cards per row with proper spacing
const CARD_MARGIN = 6;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_MARGIN * 4) / 2;

export const DashboardCard = ({ title, value, icon, color, trend, trendType, style }) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getTrendIcon = () => {
    if (trendType === 'up') return 'trending-up';
    if (trendType === 'down') return 'trending-down';
    if (trendType === 'warning') return 'alert';
    return 'minus';
  };

  const getTrendColor = () => {
    if (trendType === 'up') return theme.colors.success;
    if (trendType === 'down') return theme.colors.error;
    if (trendType === 'warning') return theme.colors.warning;
    return theme.colors.onSurfaceVariant;
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.card,
          {
            width: CARD_WIDTH,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.roundness + 2,
            shadowColor: color,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: theme.dark ? 0.2 : 0.1,
            shadowRadius: 8,
            elevation: 3,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {/* Colored top accent strip */}
        <View style={[styles.topAccent, { backgroundColor: color + '22' }]}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons name={icon} size={isSmallDevice ? 20 : 22} color={color} />
          </View>
          {trend && (
            <View style={[styles.trendContainer, { backgroundColor: getTrendColor() + '15' }]}>
              <MaterialCommunityIcons name={getTrendIcon()} size={11} color={getTrendColor()} />
              <Text
                style={[styles.trendText, { color: getTrendColor(), fontSize: normalize(9) }]}
                numberOfLines={1}
              >
                {trend}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text
            style={[styles.value, { color: theme.colors.onSurface, fontSize: normalize(isSmallDevice ? 18 : 20) }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {value}
          </Text>
          <Text
            style={[styles.title, { color: theme.colors.onSurfaceVariant, fontSize: normalize(11) }]}
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>

        {/* Bottom colored line accent */}
        <View style={[styles.bottomAccent, { backgroundColor: color }]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: CARD_MARGIN,
    overflow: 'hidden',
  },
  topAccent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    maxWidth: '55%',
  },
  trendText: {
    fontWeight: '700',
    marginLeft: 2,
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  value: {
    fontWeight: '800',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  title: {
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    lineHeight: 15,
  },
  bottomAccent: {
    height: 3,
    width: '100%',
  },
});
