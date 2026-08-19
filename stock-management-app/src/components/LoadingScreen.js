import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

export const LoadingScreen = ({ message = 'Loading inventory data...' }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? (
        <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});
