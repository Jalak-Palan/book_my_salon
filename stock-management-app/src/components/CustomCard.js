import React from 'react';
import { StyleSheet, Pressable, View, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CARD_PADDING } from '../utils/dimensions';

export const CustomCard = ({ children, onPress, style, outline = false }) => {
  const theme = useTheme();

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: theme.colors.primary + '15', borderless: false }}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.roundness + 2,
            borderColor: outline ? theme.colors.outline : 'transparent',
            borderWidth: outline ? 1 : 0,
            shadowColor: theme.dark ? '#000' : '#1E3A8A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.dark ? 0.35 : 0.07,
            shadowRadius: 8,
            elevation: 3,
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.992 : 1 }],
          },
          style,
        ]}
      >
        <View style={[styles.content, { padding: CARD_PADDING }]}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness + 2,
          borderColor: outline ? theme.colors.outline : 'transparent',
          borderWidth: outline ? 1 : 0,
          shadowColor: theme.dark ? '#000' : '#1E3A8A',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.dark ? 0.35 : 0.07,
          shadowRadius: 8,
          elevation: 3,
        },
        style,
      ]}
    >
      <View style={[styles.content, { padding: CARD_PADDING }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  content: {},
});
