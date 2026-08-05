import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, Modal, FlatList, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme, Button, Divider } from 'react-native-paper';

import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';

export default function AddSaleScreen({ navigation }) {
  const theme = useTheme();
  const { products, customers, addSale } = useContext(AppContext);

  // Selector sheets states
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [gstModalVisible, setGstModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      customer: '',
      product: '',
      productId: '',
      quantity: '',
      sellingPrice: '',
      discount: '0',
      gst: '18',
      paymentMethod: 'Cash',
    },
  });

  const selectedProduct = watch('product');

  const selectedCustomer = watch('customer');
  const selectedPayment = watch('paymentMethod');
  const selectedGst = watch('gst');

  const onSelectProduct = (prod) => {
    setValue('product', prod.name);
    setValue('productId', prod.id);
    setValue('sellingPrice', String(prod.sellingPrice));
    setProductModalVisible(false);
  };

  const onSelectCustomer = (cust) => {
    setValue('customer', cust.name);
    setCustomerModalVisible(false);
  };

  const onSelectPayment = (method) => {
    setValue('paymentMethod', method);
    setPaymentModalVisible(false);
  };

  const onSelectGst = (gstVal) => {
    setValue('gst', String(gstVal));
    setGstModalVisible(false);
  };

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!data.productId) {
      Alert.alert('Selection Error', 'Please select a product from the list.');
      return;
    }

    if (!data.customer) {
      Alert.alert('Selection Error', 'Please select a customer from the list.');
      return;
    }

    // Verify stock quantity before calling context
    const product = products.find((p) => p.id === data.productId);
    if (!product || product.quantity < Number(data.quantity)) {
      Alert.alert(
        'Out of Stock',
        `Insufficient stock. Only ${product ? product.quantity : 0} units of ${product ? product.name : 'item'} available.`
      );
      return;
    }

    const result = addSale({
      customer: data.customer,
      product: data.product,
      productId: data.productId,
      quantity: Number(data.quantity),
      sellingPrice: Number(data.sellingPrice),
      discount: Number(data.discount),
      gst: Number(data.gst),
      paymentMethod: data.paymentMethod,
    });

    if (result.success && result.sale) {
      Alert.alert('Success', 'Invoice generated successfully.', [
        {
          text: 'View Invoice',
          onPress: () => navigation.replace('InvoicePreview', { saleId: result.sale.id }),
        },
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  const paymentOptions = ['Cash', 'UPI', 'Card'];
  const gstOptions = [0, 5, 12, 18, 28];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Record New Sale</Text>

        <View style={styles.form}>
          {/* Customer Picker */}
          <Pressable onPress={() => setCustomerModalVisible(true)}>
            <View pointerEvents="none">
              <CustomInput
                label="Customer *"
                value={selectedCustomer}
                leftIcon="account-outline"
                placeholder="Click to select customer"
                error={errors.customer?.message}
                editable={false}
              />
            </View>
          </Pressable>

          {/* Product Picker */}
          <Pressable onPress={() => setProductModalVisible(true)}>
            <View pointerEvents="none">
              <CustomInput
                label="Product *"
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
                label="Sale Quantity *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                leftIcon="numeric"
                placeholder="e.g. 5"
                error={errors.quantity?.message}
              />
            )}
            name="quantity"
          />

          <Controller
            control={control}
            rules={{
              required: 'Selling Price is required',
              pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be valid pricing' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Selling Price (per unit) *"
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

          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Controller
                control={control}
                rules={{
                  pattern: { value: /^\d+(\.\d+)?$/, message: 'Must be number' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Item Discount"
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
            </View>
            <View style={styles.flexItem}>
              {/* GST Picker */}
              <Pressable onPress={() => setGstModalVisible(true)}>
                <View pointerEvents="none">
                  <CustomInput
                    label="GST Rate (%) *"
                    value={`${selectedGst}%`}
                    leftIcon="percent-outline"
                    editable={false}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Payment Method Picker */}
          <Pressable onPress={() => setPaymentModalVisible(true)}>
            <View pointerEvents="none">
              <CustomInput
                label="Payment Method *"
                value={selectedPayment}
                leftIcon="credit-card-outline"
                editable={false}
              />
            </View>
          </Pressable>

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
              Generate Invoice
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Customer Modal */}
      <Modal
        visible={customerModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCustomerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setCustomerModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Select Customer</Text>
            <Divider style={{ marginBottom: 12 }} />
            <FlatList
              data={customers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectCustomer(item)}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item.name}</Text>
                  <Text style={[styles.selectSub, { color: theme.colors.onSurfaceVariant }]}>{item.phone}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>

      {/* Product Modal */}
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
              renderItem={({ item }) => {
                const isOutOfStock = item.quantity === 0;
                return (
                  <Pressable
                    onPress={isOutOfStock ? null : () => onSelectProduct(item)}
                    style={[styles.selectRow, isOutOfStock && { opacity: 0.5 }]}
                  >
                    <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item.name}</Text>
                    <Text style={[styles.selectSub, { color: theme.colors.onSurfaceVariant }]}>
                      Price: ${item.sellingPrice} • Stock: {item.quantity} {item.unit} {isOutOfStock ? '(OUT OF STOCK)' : ''}
                    </Text>
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>

      {/* GST Modal */}
      <Modal
        visible={gstModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGstModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setGstModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, maxWidth: 260 }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Select GST Rate</Text>
            <Divider style={{ marginBottom: 12 }} />
            <FlatList
              data={gstOptions}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectGst(item)}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item}%</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setPaymentModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, maxWidth: 260 }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Select Payment Option</Text>
            <Divider style={{ marginBottom: 12 }} />
            <FlatList
              data={paymentOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectPayment(item)}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item}</Text>
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
