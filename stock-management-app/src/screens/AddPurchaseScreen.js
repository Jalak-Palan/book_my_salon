import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, Modal, FlatList, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme, Button, Divider } from 'react-native-paper';

import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';

export default function AddPurchaseScreen({ navigation }) {
  const theme = useTheme();
  const { products, suppliers, addPurchase } = useContext(AppContext);

  // Selector sheets states
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      supplier: '',
      product: '',
      productId: '',
      quantity: '',
      purchasePrice: '',
      discount: '0',
    },
  });

  const selectedProduct = watch('product');
  const selectedSupplier = watch('supplier');

  const onSelectProduct = (prod) => {
    setValue('product', prod.name);
    setValue('productId', prod.id);
    setValue('purchasePrice', String(prod.purchasePrice));
    setProductModalVisible(false);
  };

  const onSelectSupplier = (sup) => {
    setValue('supplier', sup.name);
    setSupplierModalVisible(false);
  };

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!data.productId) {
      Alert.alert('Selection Error', 'Please select a product from the list.');
      return;
    }

    if (!data.supplier) {
      Alert.alert('Selection Error', 'Please select a supplier from the list.');
      return;
    }

    addPurchase({
      supplier: data.supplier,
      product: data.product,
      productId: data.productId,
      quantity: Number(data.quantity),
      purchasePrice: Number(data.purchasePrice),
      discount: Number(data.discount),
    });

    Alert.alert('Success', 'Stock replenishment recorded successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Record Stock Purchase</Text>

        <View style={styles.form}>
          {/* Supplier Picker */}
          <Pressable onPress={() => setSupplierModalVisible(true)}>
            <View pointerEvents="none">
              <CustomInput
                label="Supplier Vendor *"
                value={selectedSupplier}
                leftIcon="truck-outline"
                placeholder="Click to select supplier"
                error={errors.supplier?.message}
                editable={false}
              />
            </View>
          </Pressable>

          {/* Product Picker */}
          <Pressable onPress={() => setProductModalVisible(true)}>
            <View pointerEvents="none">
              <CustomInput
                label="Product Item *"
                value={selectedProduct}
                leftIcon="cube-outline"
                placeholder="Click to select product"
                error={errors.product?.message}
                editable={false}
              />
            </View>
          </Pressable>

          <Controller
            control={control}
            rules={{
              required: 'Quantity is required',
              pattern: { value: /^[1-9]\d*$/, message: 'Must be greater than 0' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Purchase Quantity *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                leftIcon="numeric"
                placeholder="e.g. 50"
                error={errors.quantity?.message}
              />
            )}
            name="quantity"
          />

          <Controller
            control={control}
            rules={{
              required: 'Purchase Price is required',
              pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be valid pricing' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Purchase Price (per unit) *"
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

          <Controller
            control={control}
            rules={{
              pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be number' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Total Transaction Discount"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                leftIcon="tag-minus-outline"
                error={errors.discount?.message}
              />
            )}
            name="discount"
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
              Confirm Purchase
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Supplier Dropdown Modal */}
      <Modal
        visible={supplierModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSupplierModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setSupplierModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Select Supplier</Text>
            <Divider style={{ marginBottom: 12 }} />
            <FlatList
              data={suppliers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectSupplier(item)}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item.name}</Text>
                  <Text style={[styles.selectSub, { color: theme.colors.onSurfaceVariant }]}>{item.company}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>

      {/* Product Dropdown Modal */}
      <Modal
        visible={productModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setProductModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Select Product</Text>
            <Divider style={{ marginBottom: 12 }} />
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectProduct(item)}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item.name}</Text>
                  <Text style={[styles.selectSub, { color: theme.colors.onSurfaceVariant }]}>
                    SKU: {item.sku} • Current Stock: {item.quantity} {item.unit}
                  </Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectRow: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  selectText: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
