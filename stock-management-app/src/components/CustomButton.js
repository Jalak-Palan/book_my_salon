import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, Animated, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { normalize, MIN_TOUCH_SIZE } from '../utils/dimensions';

export const CustomButton = ({ title, onPress, type = 'primary', style, textStyle, icon, iconName, disabled = false }) => {
  const theme = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getColors = () => {
    if (disabled) {
      return {
        bg: theme.colors.outline + '60',
        text: theme.colors.onSurfaceVariant,
      };
    }
    switch (type) {
      case 'secondary':
        return {
          bg: 'transparent',
          text: theme.colors.primary,
          border: theme.colors.primary,
        };
      case 'accent':
        return {
          bg: theme.colors.secondary,
          text: '#ffffff',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.colors.onSurface,
          border: theme.colors.outline,
        };
      case 'danger':
        return {
          bg: theme.colors.error,
          text: '#ffffff',
        };
      case 'primary':
      default:
        return {
          bg: theme.colors.primary,
          text: '#ffffff',
        };
    }
  };

  const colors = getColors();

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? null : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border || 'transparent',
            borderWidth: colors.border ? 1.5 : 0,
            transform: [{ scale: scaleValue }],
            borderRadius: theme.roundness,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        {iconName && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={iconName} size={18} color={colors.text} />
          </View>
        )}
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.text, { color: colors.text, fontSize: normalize(15) }, textStyle]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    height: Math.max(52, MIN_TOUCH_SIZE),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  iconContainer: {
    marginRight: 8,
  },
});
