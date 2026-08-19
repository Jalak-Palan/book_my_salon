import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  leftIcon,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  ...props
}) => {
  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        secureTextEntry={secureTextEntry && !passwordVisible}
        keyboardType={keyboardType}
        mode="outlined"
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} color={theme.colors.onSurfaceVariant} /> : null}
        right={
          secureTextEntry ? (
            <TextInput.Icon
              icon={passwordVisible ? 'eye-off' : 'eye'}
              onPress={() => setPasswordVisible(!passwordVisible)}
              color={theme.colors.onSurfaceVariant}
            />
          ) : null
        }
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  input: {
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
});
