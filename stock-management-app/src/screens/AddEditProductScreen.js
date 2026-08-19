import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme, Button } from 'react-native-paper';
import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';

export default function AddEditProductScreen({ route, navigation }) {
  const theme = useTheme();
  const { productId } = route.params || {};
  const { products, addProduct, editProduct } = useContext(AppContext);

  const isEditMode = !!productId;
  const productToEdit = products.find((p) => p.id === productId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      supplier: '',
      purchasePrice: '',
      sellingPrice: '',
      quantity: '0',
      minStock: '5',
      brand: '',
      unit: 'pcs',
      location: '',
      description: '',
      image: '',
    },
  });

  useEffect(() => {
    if (isEditMode && productToEdit) {
      reset({
        name: productToEdit.name,
        sku: productToEdit.sku,
        category: productToEdit.category,
        supplier: productToEdit.supplier,
        purchasePrice: String(productToEdit.purchasePrice),
        sellingPrice: String(productToEdit.sellingPrice),
        quantity: String(productToEdit.quantity),
        minStock: String(productToEdit.minStock),
        brand: productToEdit.brand,
        unit: productToEdit.unit,
        location: productToEdit.location || '',
        description: productToEdit.description,
        image: productToEdit.image || '',
      });
    }
  }, [isEditMode, productToEdit, reset]);

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Fill image fallback if empty
    const imgUrl = data.image.trim() || 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=60';

    const formattedData = {
      ...data,
      purchasePrice: Number(data.purchasePrice),
      sellingPrice: Number(data.sellingPrice),
      quantity: Number(data.quantity),
      minStock: Number(data.minStock),
      image: imgUrl,
    };

    if (isEditMode) {
      editProduct(productId, formattedData);
      Alert.alert('Success', 'Product updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      addProduct(formattedData);
      Alert.alert('Success', 'Product added successfully.', [
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
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            rules={{ required: 'Product name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Product Name *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="cube-outline"
                error={errors.name?.message}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            rules={{ required: 'SKU is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="SKU / Barcode Code *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="barcode"
                error={errors.sku?.message}
                disabled={isEditMode} // Usually SKU shouldn't be edited easily
              />
            )}
            name="sku"
          />

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Category *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="tag-outline"
                    placeholder="e.g. Electronics"
                    error={errors.category?.message}
                  />
                )}
                name="category"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{ required: 'Brand name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Brand Name *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="alpha-b-box-outline"
                    placeholder="e.g. Sony"
                    error={errors.brand?.message}
                  />
                )}
                name="brand"
              />
            </View>
          </View>

          <Controller
            control={control}
            rules={{ required: 'Supplier is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Supplier *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="truck-outline"
                placeholder="e.g. Global Tech Dist"
                error={errors.supplier?.message}
              />
            )}
            name="supplier"
          />

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Purchase Price required',
                  pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be number' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Purchase Price *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="currency-usd"
                    error={errors.purchasePrice?.message}
                  />
                )}
                name="purchasePrice"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Selling Price required',
                  pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be number' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Selling Price *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="currency-usd"
                    error={errors.sellingPrice?.message}
                  />
                )}
                name="sellingPrice"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Quantity required',
                  pattern: { value: /^\d+$/, message: 'Must be integer' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Current Qty *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="numeric"
                    error={errors.quantity?.message}
                  />
                )}
                name="quantity"
              />
            </View>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  required: 'Min stock required',
                  pattern: { value: /^\d+$/, message: 'Must be integer' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Min Stock Warning *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    leftIcon="alert-box-outline"
                    error={errors.minStock?.message}
                  />
                )}
                name="minStock"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Unit Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. pcs, box, kg"
                  />
                )}
                name="unit"
              />
            </View>
            <View style={[styles.flexItem, { flex: 1.5 }]}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Image URL"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="image-outline"
                    placeholder="https://..."
                  />
                )}
                name="image"
              />
            </View>
          </View>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Storage Location / Placement"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon="map-marker-outline"
                placeholder="e.g. Shelf A1, Rack 3"
              />
            )}
            name="location"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Product Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                placeholder="Write item details here..."
              />
            )}
            name="description"
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
              Save Product
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
