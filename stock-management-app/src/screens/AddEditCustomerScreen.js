import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme, Button } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';

export default function AddEditCustomerScreen({ route, navigation }) {
  const theme = useTheme();
  const { customerId } = route.params || {};
  const { customers, addCustomer, editCustomer } = useContext(AppContext);

  const isEditMode = !!customerId;
  const customerToEdit = customers.find((c) => c.id === customerId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  useEffect(() => {
    if (isEditMode && customerToEdit) {
      reset({
        name: customerToEdit.name,
        phone: customerToEdit.phone,
        email: customerToEdit.email,
        address: customerToEdit.address,
      });
    }
  }, [isEditMode, customerToEdit, reset]);

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (isEditMode) {
      editCustomer(customerId, data);
      Alert.alert('Success', 'Customer details updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      addCustomer(data);
      Alert.alert('Success', 'Customer added successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          {isEditMode ? 'Modify Customer Info' : 'Add New Customer'}
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            rules={{ required: 'Customer Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Customer Name *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="account-outline"
                error={errors.name?.message}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Phone Number *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                leftIcon="phone"
                error={errors.phone?.message}
              />
            )}
            name="phone"
          />

          <Controller
            control={control}
            rules={{
              required: 'Email address is required',
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Email Address *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                leftIcon="email-outline"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Street Address *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="map-marker-outline"
                multiline
                numberOfLines={2}
                error={errors.address?.message}
              />
            )}
            name="address"
          />

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.btn}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.btn}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Customer
            </Button>
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
  scrollBody: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  btn: {
    flex: 1,
    marginHorizontal: 6,
  },
});
