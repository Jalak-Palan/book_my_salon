import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export default function OtpVerificationScreen({ route, navigation }) {
  const theme = useTheme();
  const { email } = route.params || { email: 'user@example.com' };
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { code: '' },
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Accept dummy OTP "1234"
    if (data.code === '1234' || data.code.trim().length === 4) {
      navigation.navigate('ResetPassword');
    } else {
      setError('code', { type: 'manual', message: 'Invalid OTP code. Try "1234" or any 4 digit code.' });
    }
  };

  const handleResend = () => {
    setTimer(30);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="shield-check-outline" size={44} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>OTP Verification</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Enter the 4-digit code sent to <Text style={styles.boldText}>{email}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            rules={{
              required: 'Verification code is required',
              minLength: { value: 4, message: 'OTP must be 4 digits' },
              maxLength: { value: 4, message: 'OTP must be 4 digits' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="4-Digit Code"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                leftIcon="numeric"
                maxLength={4}
                error={errors.code?.message}
                placeholder="e.g. 1234"
              />
            )}
            name="code"
          />

          <CustomButton
            title="Verify Code"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={styles.btn}
          />

          <View style={styles.timerRow}>
            {timer > 0 ? (
              <Text style={[styles.timerText, { color: theme.colors.onSurfaceVariant }]}>
                Resend code in {timer}s
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text style={[styles.resendLink, { color: theme.colors.primary }]}>Resend Code</Text>
              </Pressable>
            )}
          </View>
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
  boldText: {
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  btn: {
    marginTop: 16,
  },
  timerRow: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
