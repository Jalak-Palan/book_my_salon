import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { normalize } from '../utils/dimensions';

export const SectionHeader = ({ title, actionTitle, onActionPress, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleRow}>
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: theme.colors.primary }]} />
        <Text style={[styles.title, { color: theme.colors.onSurface, fontSize: normalize(16) }]}>
          {title}
        </Text>
      </View>
      {actionTitle && onActionPress && (
        <Pressable
          onPress={onActionPress}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.action, { color: theme.colors.primary, fontSize: normalize(13) }]}>
            {actionTitle} →
          </Text>
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
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    marginRight: 10,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  action: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
