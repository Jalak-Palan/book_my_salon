import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

export const CustomButton = ({ title, onPress, type = 'primary', style, textStyle, icon, disabled = false }) => {
  const theme = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
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
        bg: theme.colors.outline,
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
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border || 'transparent',
            borderWidth: colors.border ? 1 : 0,
            transform: [{ scale: scaleValue }],
            borderRadius: theme.roundness,
          },
          style,
        ]}
      >
        {icon && <Animated.View style={styles.iconContainer}>{icon}</Animated.View>}
        <Text style={[styles.text, { color: colors.text }, textStyle]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  iconContainer: {
    marginRight: 8,
  },
});
