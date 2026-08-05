import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme, Button } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';

export default function AddEditSupplierScreen({ route, navigation }) {
  const theme = useTheme();
  const { supplierId } = route.params || {};
  const { suppliers, addSupplier, editSupplier } = useContext(AppContext);

  const isEditMode = !!supplierId;
  const supplierToEdit = suppliers.find((s) => s.id === supplierId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      country: '',
    },
  });

  useEffect(() => {
    if (isEditMode && supplierToEdit) {
      reset({
        name: supplierToEdit.name,
        company: supplierToEdit.company,
        phone: supplierToEdit.phone,
        email: supplierToEdit.email,
        address: supplierToEdit.address,
        city: supplierToEdit.city,
        state: supplierToEdit.state,
        country: supplierToEdit.country,
      });
    }
  }, [isEditMode, supplierToEdit, reset]);

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (isEditMode) {
      editSupplier(supplierId, data);
      Alert.alert('Success', 'Supplier details updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      addSupplier(data);
      Alert.alert('Success', 'Supplier registered successfully.', [
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
          {isEditMode ? 'Modify Supplier Record' : 'Register Supplier'}
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            rules={{ required: 'Supplier Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Supplier Name *"
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
            rules={{ required: 'Company Name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Company Name *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="domain"
                error={errors.company?.message}
              />
            )}
            name="company"
          />

          <View style={styles.row}>
            <View style={styles.flexItem}>
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
            </View>
            <View style={styles.flexItem}>
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
            </View>
          </View>

          <Controller
            control={control}
            rules={{ required: 'Street Address is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Street Address *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="map-marker-outline"
                error={errors.address?.message}
              />
            )}
            name="address"
          />

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{ required: 'City is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="City *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.city?.message}
                  />
                )}
                name="city"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{ required: 'State is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="State / Province *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.state?.message}
                  />
                )}
                name="state"
              />
            </View>
          </View>

          <Controller
            control={control}
            rules={{ required: 'Country is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Country *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="earth"
                error={errors.country?.message}
              />
            )}
            name="country"
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
              Save Supplier
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  flexItem: {
    flex: 1,
    marginHorizontal: 4,
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
