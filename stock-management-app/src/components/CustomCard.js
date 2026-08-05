import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export const CustomCard = ({ children, onPress, style, outline = false }) => {
  const theme = useTheme();

  const CardWrapper = onPress ? Pressable : View;

  return (
    <CardWrapper
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness,
          borderColor: outline ? theme.colors.outline : 'transparent',
          borderWidth: outline ? 1 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.dark ? 0.3 : 0.06,
          shadowRadius: 8,
          elevation: 3,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>{children}</View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  content: {
    padding: 16,
  },
});
