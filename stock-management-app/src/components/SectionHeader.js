import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';

export const SectionHeader = ({ title, actionTitle, onActionPress, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      {actionTitle && onActionPress && (
        <Pressable onPress={onActionPress}>
          <Text style={[styles.action, { color: theme.colors.primary }]}>{actionTitle}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
  },
});
