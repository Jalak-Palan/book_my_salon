import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export default function ResetPasswordScreen({ navigation }) {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    Alert.alert(
      'Password Reset Success',
      'Your password has been reset successfully. Please log in with your new password.',
      [{ text: 'OK', onPress: () => navigation.replace('Login') }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="lock-open-outline" size={44} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Set your new login credentials. Make sure it is strong and secure.
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            rules={{
              required: 'New password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="New Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                leftIcon="lock-outline"
                autoCapitalize="none"
                error={errors.password?.message}
              />
            )}
            name="password"
          />

          <Controller
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: (value) => value === passwordVal || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                leftIcon="lock-check-outline"
                autoCapitalize="none"
                error={errors.confirmPassword?.message}
              />
            )}
            name="confirmPassword"
          />

          <CustomButton
            title="Reset & Login"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  btn: {
    marginTop: 16,
  },
});
